using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.DocumentDto {
    public class UpdateDocumentDto {
        [StringLength(250, MinimumLength = 5, ErrorMessage = "Name must be between 5 and 250 characters")]
        public string? Name { get; set; }

        [StringLength(5000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 5000 characters")]
        public string? Description { get; set; }

        // price 0 = free
        [Range(0, int.MaxValue, ErrorMessage = "Price must be larger than 0")]
        public decimal? Price { get; set; }
    }
}
