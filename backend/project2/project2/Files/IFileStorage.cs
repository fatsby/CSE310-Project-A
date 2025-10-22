namespace project2.Files {
    public interface IFileStorage {
        Task<StoredFile> SaveAsync(Stream stream, string fileName, string contentType, string subfolder, CancellationToken ct);
        Task DeleteAsync(string storagePath, CancellationToken ct);
    }
}
