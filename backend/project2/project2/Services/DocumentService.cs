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

        public async Task<DocumentResponse> CreateAsync(int authorId, CreateDocumentRequest req, CancellationToken ct) {
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
            var sort = 0;
            foreach (var img in req.Images ?? []) {
                await using var imgStream = img.OpenReadStream();
                var storedImg = await _storage.SaveAsync(imgStream, img.FileName, img.ContentType, subfolder: $"documents/{doc.Id}/images", ct);
                var docImg = new DocumentImage {
                    Url = storedImg.Url,
                    StoragePath = storedImg.StoragePath,
                    SortOrder = sort++,
                };
                _db.DocumentImages.Add(docImg);
            }

            //saving files
            foreach (var file in req.Files ?? []) {
                await using var s = file.OpenReadStream();
                var stored = await _storage.SaveAsync(s, file.FileName, file.ContentType,
                    subfolder: $"documents/{doc.Id}/files", ct);

                doc.Files.Add(new DocumentFile {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    SizeBytes = stored.Size,
                    Url = stored.Url,          // later protect downloads, store only StoragePath and serve via controller
                    StoragePath = stored.StoragePath
                });
            }

            await _db.SaveChangesAsync(ct);

            return new DocumentResponse {
                Id = doc.Id,
                Name = doc.Name,
                Description = doc.Description,
                Price = doc.Price,
                UniversityId = doc.UniversityId,
                UniversityName = doc.University.Name,
                SubjectId = doc.SubjectId,
                SubjectName = doc.Subject.Name,
                Images = doc.Images.OrderBy(i => i.SortOrder).Select(i => i.Url),
                Files = doc.Files.Select(f => (f.Id, f.FileName, f.SizeBytes))
            };

        }

        public async Task<(Stream stream, string contentType, string downloadName)?> OpenFileForDownloadAsync(int docId, int fileId, int userId, CancellationToken ct) {
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
