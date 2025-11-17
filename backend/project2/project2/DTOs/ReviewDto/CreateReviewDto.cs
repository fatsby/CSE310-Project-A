using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.ReviewDto {
    public class CreateReviewDto {
        [Required]
        public int DocumentId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
        public string? Comment { get; set; }
    }
}
