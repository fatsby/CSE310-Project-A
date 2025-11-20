
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.ReviewDto;
using project2.Models;

namespace project2.Services {
    public class ReviewService : IReviewService {
        private readonly AppDbContext _db;

        public ReviewService(AppDbContext db) {
            _db = db;
        }

        public async Task<List<ReviewDto>> GetReviewsAsync(string? userId, int? documentId)
        {
            var query = _db.Reviews.AsNoTracking();

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(r => r.UserId == userId);

            if (documentId.HasValue)
                query = query.Where(r => r.DocumentId == documentId.Value);

            if (string.IsNullOrEmpty(userId) && !documentId.HasValue)
            {
                return new List<ReviewDto>();
            }

            var dtos = await query
                .Select(r => new ReviewDto
                {
                    UserId = r.UserId,
                    UserName = r.User.UserName,
                    DocumentId = r.DocumentId,
                    DocumentName = r.Document.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return dtos;
        }

        public async Task<ReviewDto> CreateAsync(string userId, CreateReviewDto dto, CancellationToken ct) {
            using var tx = await _db.Database.BeginTransactionAsync(ct);

            //find document
            var document = await _db.Documents
                .FirstOrDefaultAsync(d => d.Id == dto.DocumentId, ct);

            if (document == null)
                throw new KeyNotFoundException("Document not found.");

            // find the user (for validations)
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Id == userId, ct);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            // validations
            if (!document.isActive || document.isDeleted)
                throw new InvalidOperationException("This document is not available for review.");

            if (document.AuthorId == userId)
                throw new InvalidOperationException("You cannot review your own document.");

            var existingReview = await _db.Reviews
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.UserId == userId && r.DocumentId == dto.DocumentId, ct);

            if (existingReview != null)
                throw new InvalidOperationException("You have already reviewed this document.");

            var hasPurchased = await _db.UserPurchases
                .AsNoTracking()
                .AnyAsync(p => p.UserId == userId && p.DocumentId == dto.DocumentId, ct);

            if (!hasPurchased)
                throw new UnauthorizedAccessException("You must purchase this document to review it.");

            // create review
            var review = new Review {
                UserId = userId,
                DocumentId = dto.DocumentId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? "",
                ReviewDate = DateTime.UtcNow
            };

            _db.Reviews.Add(review);

            await _db.SaveChangesAsync(ct); //save the review first to calculate avg rating later

            // update the document avg rating
            await UpdateDocumentRatingAsync(document);

            //save all changes made to document
            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // return dto
            return ToDto(review, user.UserName, document.Name);
        }

        public async Task<ReviewDto> UpdateAsync(string userId, int documentId, UpdateReviewDto dto, CancellationToken ct) {
            using var tx = await _db.Database.BeginTransactionAsync(ct);

            // find review using composite key
            var review = await _db.Reviews
                .Include(r => r.Document)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.DocumentId == documentId, ct);

            if (review == null)
                throw new KeyNotFoundException("Review not found.");

            review.Rating = dto.Rating;
            review.Comment = dto.Comment ?? "";
            review.ReviewDate = DateTime.UtcNow;

            await _db.SaveChangesAsync(ct); //save the review first to calculate avg rating later

            await UpdateDocumentRatingAsync(review.Document);

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // return dto
            return ToDto(review, review.User.UserName, review.Document.Name);
        }

        public async Task DeleteAsync(string userId, int documentId, CancellationToken ct) {
            using var tx = await _db.Database.BeginTransactionAsync(ct);
            // find review using composite key
            var review = await _db.Reviews
                .Include(r => r.Document)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.DocumentId == documentId, ct);
            if (review == null)
                throw new KeyNotFoundException("Review not found.");
            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync(ct); //save the deletion first to calculate avg rating later
            await UpdateDocumentRatingAsync(review.Document);
            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);
        }

        //public method
        public async Task RecalculateDocumentRatingAsync(int documentId) {
            var document = await _db.Documents.FindAsync(documentId);
            if (document == null) return;

            await UpdateDocumentRatingAsync(document);
            await _db.SaveChangesAsync();
        }

        //private helper method WITHOUT saving
        private async Task UpdateDocumentRatingAsync(Document document) {
            var newReviewCount = await _db.Reviews
                .Where(r => r.DocumentId == document.Id)
                .CountAsync();

            if (newReviewCount == 0) {
                document.ReviewCount = 0;
                document.AverageRating = 0;
            } else {
                var newAverageRating = await _db.Reviews
                    .Where(r => r.DocumentId == document.Id)
                    .AverageAsync(r => (decimal)r.Rating);

                document.ReviewCount = newReviewCount;
                document.AverageRating = newAverageRating;
            }
        }

        private static ReviewDto ToDto(Review review, string? userName, string? documentName) {
            return new ReviewDto {
                UserId = review.UserId,
                UserName = userName,
                DocumentId = review.DocumentId,
                DocumentName = documentName,
                Rating = review.Rating,
                Comment = review.Comment,
                ReviewDate = review.ReviewDate
            };
        }

        public async Task<double> GetAverageRatingsAsync(CancellationToken ct) {
            var reviewsList = await _db.Reviews.ToListAsync();

            if (reviewsList.Count == 0) {
                return 0; // no review exists
            }

            var totalAverageRating = reviewsList.Average(r => r.Rating);

            return totalAverageRating;
        }
    }
}
