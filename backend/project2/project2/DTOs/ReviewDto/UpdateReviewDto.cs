using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.ReviewDto {
    public class UpdateReviewDto {
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(2000)]
        public string? Comment { get; set; }
    }
}
