using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.DocumentDto;
using project2.Files;
using project2.Models;

namespace project2.Services {
    public class DocumentService : IDocumentService {
        private static readonly HashSet<string> ImageTypes = new(StringComparer.OrdinalIgnoreCase) {
            "image/jpeg",
            "image/png",
            "image/webp",
        };

        private static readonly HashSet<string> AllowedFileTypes = new(StringComparer.OrdinalIgnoreCase) {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
        };

        private const int MaxImageCount = 5;
        private const long MaxImageSize = 5 * 1024 * 1024;  // 5 MB
        private const long MaxFileSize = 100 * 1024 * 1024; // 100 MB

        private readonly AppDbContext _db;
        private readonly IFileStorage _storage;
        private readonly IWebHostEnvironment _env;
        private readonly IBalanceManager _balanceManager;

        public DocumentService(AppDbContext db, IFileStorage storage, IWebHostEnvironment env, IBalanceManager balanceManager) {
            _db = db;
            _storage = storage;
            _env = env;
            _balanceManager = balanceManager;
        }

        public async Task<DocumentResponse> CreateAsync(string authorId, CreateDocumentRequest req, CancellationToken ct) {
            using var tx = await _db.Database.BeginTransactionAsync(ct);

            //request validations
            if (req.Images is null || req.Images.Count is < 1 or > MaxImageCount)
                throw new ArgumentException($"You must upload between 1 and {MaxImageCount} images.");

            if (req.Files is null || req.Files.Count < 1)
                throw new ArgumentException("You must upload at least one file.");

            foreach (var img in req.Images) {
                if (img.Length <= 0 || img.Length > MaxImageSize)
                    throw new ArgumentException("Image too large (max 5MB).");
                if (!ImageTypes.Contains(img.ContentType))
                    throw new ArgumentException("Invalid image type. Use JPG/PNG/WebP.");
            }


            foreach (var f in req.Files) {
                if (f.Length <= 0 || f.Length > MaxFileSize)
                    throw new ArgumentException("A file is too large (max 100MB).");
                if (!AllowedFileTypes.Contains(f.ContentType))
                    throw new ArgumentException($"File type not allowed: {f.ContentType}");
            }

            var doc = new Document {
                AuthorId = authorId,
                Name = req.Name.Trim(),
                Description = req.Description.Trim(),
                Price = req.Price,
                UniversityId = req.UniversityId,
                SubjectId = req.SubjectId
            };

            _db.Documents.Add(doc);
            await _db.SaveChangesAsync(ct);

            //saving images
            var toCleanup = new List<(string path, bool isPublic)>();
            var sort = 0;
            try {
                // IMAGES (PUBLIC)
                foreach (var img in req.Images) {
                    await using var s = img.OpenReadStream();
                    var stored = await _storage.SaveAsync(s, img.FileName, img.ContentType,
                        $"documents/{doc.Id}/images",
                        isPublic: true,
                        ct);

                    toCleanup.Add((stored.StoragePath, true));

                    doc.Images.Add(new DocumentImage {
                        Url = stored.Url!,
                        StoragePath = stored.StoragePath,
                        SortOrder = sort++
                    });
                }

                // FILES (PRIVATE)
                foreach (var file in req.Files ?? []) {
                    await using var s = file.OpenReadStream();
                    var stored = await _storage.SaveAsync(s, file.FileName, file.ContentType,
                        $"documents/{doc.Id}/files",
                        isPublic: false,
                        ct);

                    toCleanup.Add((stored.StoragePath, false));

                    doc.Files.Add(new DocumentFile {
                        FileName = file.FileName,
                        ContentType = file.ContentType,
                        SizeBytes = stored.Size,
                        StoragePath = stored.StoragePath
                    });
                }

                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
            } catch {
                await tx.RollbackAsync(ct);
                // cleanup files saved to disk if DB failed
                foreach (var (path, isPublic) in toCleanup)
                    await _storage.DeleteAsync(path, isPublic, ct);
                throw;
            }

            var full = await _db.Documents
                .Include(d => d.University)
                .Include(d => d.Subject)
                .Include(d => d.Images)
                .Include(d => d.Files)
                .FirstAsync(d => d.Id == doc.Id, ct);

            return new DocumentResponse {
                Id = full.Id,
                Name = full.Name,
                Description = full.Description,
                Price = full.Price,
                UniversityId = full.UniversityId,
                UniversityName = full.University?.Name ?? string.Empty,
                SubjectId = full.SubjectId,
                SubjectName = full.Subject?.Name ?? string.Empty,
                Images = full.Images.OrderBy(i => i.SortOrder).Select(i => i.Url),
                Files = full.Files.Select(f => new DocumentFileDto {
                    Id = f.Id,
                    FileName = f.FileName,
                    SizeBytes = f.SizeBytes
                })
            };

        }

        public async Task<(Stream stream, string contentType, string downloadName)?> OpenFileForDownloadAsync(int docId, int fileId, string userId, CancellationToken ct) {
            var file = await _db.DocumentFiles
                .Include(f => f.Document)
                .FirstOrDefaultAsync(f => f.Id == fileId && f.DocumentId == docId, ct);
            if (file is null) return null;

            // check ownership / purchase
            bool isAuthor = file.Document.AuthorId == userId;
            //if not author, check purchase
            bool hasPurchased = false;
            if (!isAuthor) {
                hasPurchased = await _db.UserPurchases
                    .AnyAsync(p => p.UserId == userId && p.DocumentId == docId, ct);
            }

            if (!isAuthor && !hasPurchased) {
                throw new UnauthorizedAccessException("You do not have permission to download this file.");
            }

            // Open file stream
            var privateRootPath = Path.Combine(_env.ContentRootPath, "_PrivateStorage");
            var fullPath = Path.Combine(privateRootPath, file.StoragePath);

            if (!System.IO.File.Exists(fullPath)) return null;

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            file.DownloadCount++;
            await _db.SaveChangesAsync(ct);

            return (stream, file.ContentType, file.FileName);
        }

        public async Task<PurchaseResponse> PurchaseDocumentsAsync(PurchaseRequest req, string buyerUserId, CancellationToken ct) {
            using var tx = await _db.Database.BeginTransactionAsync(ct);

            try {
                // get buyer user from db
                var buyer = await _db.Users
                    .FirstOrDefaultAsync(u => u.Id == buyerUserId, ct);
                if (buyer is null)
                    throw new KeyNotFoundException("Buyer account not found.");

                // get all docs
                var distinctDocIds = req.DocumentIds.Distinct().ToList();
                var documents = await _db.Documents
                    .Where(d => distinctDocIds.Contains(d.Id))
                    .ToListAsync(ct);

                // validate all documents found
                if (documents.Count != distinctDocIds.Count)
                    throw new KeyNotFoundException("One or more documents not found.");

                // validate ownership
                var existingPurchases = await _db.UserPurchases
                    .Where(p => p.UserId == buyerUserId && distinctDocIds.Contains(p.DocumentId))
                    .Select(p => p.DocumentId)
                    .ToHashSetAsync(ct);

                // price calculations
                decimal originalTotalPrice = 0;
                var newPurchases = new List<UserPurchase>();
                // store the price share for each author which is 90% of the original price
                var authorPriceShare = new Dictionary<string, decimal>();

                foreach (var doc in documents) {
                    //SELF-NOTE: add IsActive boolean for Document and replace this
                    if (doc.Price is null || doc.Price <= 0)
                        throw new InvalidOperationException($"Document '{doc.Name}' is not for sale.");
                    if (doc.AuthorId == buyerUserId)
                        throw new InvalidOperationException($"You cannot buy your own document ('{doc.Name}').");
                    if (existingPurchases.Contains(doc.Id))
                        throw new InvalidOperationException($"You have already purchased '{doc.Name}'.");

                    originalTotalPrice += doc.Price.Value;
                    authorPriceShare[doc.AuthorId] =
                        authorPriceShare.GetValueOrDefault(doc.AuthorId) + (doc.Price.Value*0.9m);
                }

                // apply Coupon
                decimal finalPrice = originalTotalPrice;
                decimal discountPercentage = 0;
                decimal discountAmount = 0;

                if (!string.IsNullOrWhiteSpace(req.CouponCode)) {
                    var coupon = await _db.Coupons
                        .FirstOrDefaultAsync(c => c.Code == req.CouponCode.ToUpperInvariant(), ct);

                    if (coupon == null || !coupon.IsActive || coupon.ExpiryDate < DateTime.UtcNow)
                        throw new InvalidOperationException("The provided coupon is invalid or has expired.");

                    discountPercentage = coupon.DiscountPercentage;
                    discountAmount = originalTotalPrice * (discountPercentage / 100);
                    finalPrice = originalTotalPrice - discountAmount;
                }


                // create Purchase Records
                foreach (var doc in documents) {
                    // PricePaid reflect the DISCOUNTED price for that item
                    decimal itemDiscount = doc.Price.Value * (discountPercentage / 100);
                    decimal itemFinalPrice = doc.Price.Value - itemDiscount;

                    newPurchases.Add(new UserPurchase {
                        UserId = buyerUserId,
                        DocumentId = doc.Id,
                        PricePaid = itemFinalPrice,
                        PurchasedAt = DateTime.UtcNow
                    });
                }

                // call Balance Manager
                await _balanceManager.TransferAsync(buyerUserId, finalPrice, authorPriceShare, ct);

                // save purchase records & update db
                _db.UserPurchases.AddRange(newPurchases);
                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);

                // response
                return new PurchaseResponse {
                    ItemsPurchased = newPurchases.Count,
                    OriginalPrice = originalTotalPrice,
                    DiscountApplied = discountAmount,
                    TotalPricePaid = finalPrice,
                    NewUserBalance = buyer.Balance,
                    PurchasedDocumentIds = newPurchases.Select(p => p.DocumentId).ToList()
                };
            } catch {
                await tx.RollbackAsync(ct);
                throw;
            }
        }

        public async Task<DocumentResponse?> UpdateAsync(int documentId, string userId, UpdateDocumentDto dto, CancellationToken ct) {
            // find the document
            var doc = await _db.Documents
                .FirstOrDefaultAsync(d => d.Id == documentId, ct);

            if (doc is null) {
                return null; // 404 not found
            }

            // check if user is author
            if (doc.AuthorId != userId) {
                throw new UnauthorizedAccessException("You are not the owner of this document.");
            }

            // apply updates
            bool hasChanges = false;
            if (dto.Name is not null) {
                doc.Name = dto.Name.Trim();
                hasChanges = true;
            }

            if (dto.Description is not null) {
                doc.Description = dto.Description.Trim();
                hasChanges = true;
            }

            // treat 0 as free
            if (dto.Price.HasValue) {
                doc.Price = dto.Price.Value;
                hasChanges = true;
            }

            // save if changed
            if (hasChanges) {
                await _db.SaveChangesAsync(ct);
            }

            // return the updated document data
            var full = await _db.Documents
                .AsNoTracking()
                .Include(d => d.University)
                .Include(d => d.Subject)
                .Include(d => d.Images)
                .Include(d => d.Files)
                .FirstAsync(d => d.Id == doc.Id, ct);

            return new DocumentResponse {
                Id = full.Id,
                Name = full.Name,
                Description = full.Description,
                Price = full.Price,
                UniversityId = full.UniversityId,
                UniversityName = full.University.Name,
                SubjectId = full.SubjectId,
                SubjectName = full.Subject.Name,
                Images = full.Images.OrderBy(i => i.SortOrder).Select(i => i.Url),
                Files = full.Files.Select(f => new DocumentFileDto {
                    Id = f.Id,
                    FileName = f.FileName,
                    SizeBytes = f.SizeBytes
                })
            };
        }
    }
}
