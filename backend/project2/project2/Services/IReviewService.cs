using project2.DTOs.ReviewDto;

namespace project2.Services {
    public interface IReviewService {
        Task RecalculateDocumentRatingAsync(int documentId);
        Task<ReviewDto> GetReviewAsync(string? userId, int? documentId);
        Task<ReviewDto> CreateAsync(string userId, CreateReviewDto dto, CancellationToken ct);
        Task<ReviewDto> UpdateAsync(string userId, int documentId, UpdateReviewDto dto, CancellationToken ct);
        Task DeleteAsync(string userId, int documentId, CancellationToken ct);
    }
}
