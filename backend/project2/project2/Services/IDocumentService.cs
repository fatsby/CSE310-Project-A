using project2.DTOs.DocumentDto;

namespace project2.Services {
    public interface IDocumentService {
        Task<DocumentResponse> CreateAsync(string authorId, CreateDocumentRequest req, CancellationToken ct);
        Task<(Stream stream, string contentType, string downloadName)?> OpenFileForDownloadAsync(int docId, int fileId, string userId, CancellationToken ct);
        Task<PurchaseResponse> PurchaseDocumentsAsync(PurchaseRequest req, string buyerUserId, CancellationToken ct);
        Task<DocumentResponse?> UpdateAsync(int documentId, string userId, UpdateDocumentDto dto, CancellationToken ct);
    }
}
