namespace project2.Files {
    public class LocalFileStorage : IFileStorage {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _http;

        public LocalFileStorage(IWebHostEnvironment env, IHttpContextAccessor http) { _env = env; _http = http; }

        public async Task<StoredFile> SaveAsync(Stream stream, string fileName, string contentType, string subfolder, CancellationToken ct) {
            var safeName = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
            var folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", subfolder);
            Directory.CreateDirectory(folder);
            var fullPath = Path.Combine(folder, safeName);

            await using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
                await stream.CopyToAsync(fs, ct);

            // Build a URL like /uploads/{subfolder}/{filename}
            var request = _http.HttpContext!.Request;
            var basePath = $"{request.Scheme}://{request.Host}";
            var url = $"{basePath}/uploads/{subfolder}/{safeName}";
            var storagePath = Path.Combine("uploads", subfolder, safeName).Replace('\\', '/');

            return new StoredFile(url, storagePath, new FileInfo(fullPath).Length, contentType);
        }

        public Task DeleteAsync(string storagePath, CancellationToken ct) {
            var fullPath = Path.Combine(_env.WebRootPath ?? "wwwroot", storagePath);
            if (File.Exists(fullPath)) File.Delete(fullPath);
            return Task.CompletedTask;
        }
    }
}
