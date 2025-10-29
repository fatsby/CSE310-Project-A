using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs;
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

        public DocumentService(AppDbContext db, IFileStorage storage, IWebHostEnvironment env) {
            _db = db;
            _storage = storage;
            _env = env;
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
            var toCleanup = new List<string>();
            var sort = 0;
            try {
                // IMAGES — add via nav so EF sets DocumentId
                foreach (var img in req.Images) {
                    await using var s = img.OpenReadStream();
                    var stored = await _storage.SaveAsync(s, img.FileName, img.ContentType,
                        $"documents/{doc.Id}/images", ct);

                    toCleanup.Add(stored.StoragePath);

                    doc.Images.Add(new DocumentImage {
                        Url = stored.Url,
                        StoragePath = stored.StoragePath,
                        SortOrder = sort++
                    });
                }

                // FILES — via nav or explicitly set DocumentId = doc.Id
                foreach (var file in req.Files ?? []) {
                    await using var s = file.OpenReadStream();
                    var stored = await _storage.SaveAsync(s, file.FileName, file.ContentType,
                        $"documents/{doc.Id}/files", ct);

                    toCleanup.Add(stored.StoragePath);

                    doc.Files.Add(new DocumentFile {
                        FileName = file.FileName,
                        ContentType = file.ContentType,
                        SizeBytes = stored.Size,
                        Url = stored.Url,
                        StoragePath = stored.StoragePath
                    });
                }

                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
            } catch {
                await tx.RollbackAsync(ct);
                // cleanup files saved to disk if DB failed
                foreach (var path in toCleanup)
                    await _storage.DeleteAsync(path, ct);
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

            // TODO: enforce purchase/ownership check here
            // bool allowed = userId == file.Document.AuthorId || await _purchases.HasPurchased(userId, docId);
            // if (!allowed) throw new UnauthorizedAccessException();

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.StoragePath);
            if (!System.IO.File.Exists(fullPath)) return null;

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            file.DownloadCount++;
            await _db.SaveChangesAsync(ct);

            return (stream, file.ContentType, file.FileName);
        }
    }
}
