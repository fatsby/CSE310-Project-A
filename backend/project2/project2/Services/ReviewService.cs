
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

        public async Task<ReviewDto> GetReviewAsync(string userId, int documentId) {
            var review = await _db.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.DocumentId == documentId);

            if (review == null)
                throw new KeyNotFoundException("Review not found.");

            return ToDto(review, review.User.UserName);
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

            // update the document avg rating
            await UpdateDocumentRatingAsync(document);

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // return dto
            return ToDto(review, user.UserName);
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

        private static ReviewDto ToDto(Review review, string? userName) {
            return new ReviewDto {
                UserId = review.UserId,
                UserName = userName,
                DocumentId = review.DocumentId,
                Rating = review.Rating,
                Comment = review.Comment,
                ReviewDate = review.ReviewDate
            };
        }
    }
}
