using project2.DTOs.DocumentDto;

namespace project2.Services {
    public interface IDocumentService {
        Task<DocumentResponse> GetDocumentResponseByIdAsync(int documentId, CancellationToken ct);
        Task<DocumentResponse> CreateAsync(string authorId, CreateDocumentRequest req, CancellationToken ct);
        Task<(Stream stream, string contentType, string downloadName)?> OpenFileForDownloadAsync(int docId, int fileId, string? userId, CancellationToken ct);
        Task<PurchaseResponse> PurchaseDocumentsAsync(PurchaseRequest req, string buyerUserId, CancellationToken ct);
        Task<DocumentResponse> UpdateAsync(int documentId, string? userId, UpdateDocumentDto dto, CancellationToken ct);
        Task<DocumentResponse> ActiveSwitchAsync(int documentId, string? userId, bool isActive, CancellationToken ct);
        Task<DocumentResponse> DeleteAsync(int documentId, bool isDeleted, CancellationToken ct);

        Task<DocumentFileDto> AddFileAsync(int documentId, string userId, IFormFile file, CancellationToken ct);
        Task DeleteFileAsync(int documentId, int fileId, string? userId, CancellationToken ct);

        Task<UploadImageResponseDTO> AddImageAsync(int documentId, string userId, IFormFile image, CancellationToken ct);
        Task DeleteImageAsync(int documentId, int imageId, string? userId, CancellationToken ct);
        Task<List<DocumentResponse>> GetTopRatedDocumentsAsync(CancellationToken ct);
        Task<List<DocumentResponse>> GetBestSellingDocumentsAsync(CancellationToken ct);
        Task<List<DocumentResponse>> GetPurchasedDocumentsAsync(string userId, CancellationToken ct);
        Task<List<DocumentResponse>> GetAllDeletedDocumentsAsync(CancellationToken ct);
        Task<List<DocumentResponse>> GetAllAndInactiveDocuments(CancellationToken ct);
    }
}
