namespace project2.Files {
    public interface IFileStorage {
        Task<StoredFile> SaveAsync(Stream stream, string fileName, string contentType, string subfolder, bool isPublic, CancellationToken ct);
        Task DeleteAsync(string storagePath, bool isPublic, CancellationToken ct);
    }
}
