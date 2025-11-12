namespace project2.Files {
    public class LocalFileStorage : IFileStorage {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _http;
        private readonly string _publicRootPath;
        private readonly string _privateRootPath;

        public LocalFileStorage(IWebHostEnvironment env, IHttpContextAccessor http) {
            _env = env;
            _http = http;

            // public files
            _publicRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            // private files
            _privateRootPath = Path.Combine(_env.ContentRootPath, "_PrivateStorage");
        }

        public async Task<StoredFile> SaveAsync(
            Stream stream,
            string fileName,
            string contentType,
            string subfolder,
            bool isPublic,
            CancellationToken ct) {
            // determine root path
            var rootPath = isPublic ? _publicRootPath : _privateRootPath;

            //public files go in wwwroot/uploads
            var storagePrefix = isPublic ? "uploads" : string.Empty;

            var safeName = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
            var finalSubfolder = Path.Combine(storagePrefix, subfolder);
            var folder = Path.Combine(rootPath, finalSubfolder);

            Directory.CreateDirectory(folder);

            var fullPath = Path.Combine(folder, safeName);

            await using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
                await stream.CopyToAsync(fs, ct);

            // create the relative storage path
            var storagePath = Path.Combine(finalSubfolder, safeName).Replace('\\', '/');

            // build url for public images
            string? url = null;
            if (isPublic) {
                var request = _http.HttpContext!.Request;
                var basePath = $"{request.Scheme}://{request.Host}";
                url = $"{basePath}/{storagePath}"; // /uploads/documents/1/images/guid.jpg
            }

            return new StoredFile(url, storagePath, new FileInfo(fullPath).Length, contentType);
        }

        public Task DeleteAsync(string storagePath, bool isPublic, CancellationToken ct) {
            // which root to use
            var rootPath = isPublic ? _publicRootPath : _privateRootPath;
            var fullPath = Path.Combine(rootPath, storagePath);

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            return Task.CompletedTask;
        }
    }
}