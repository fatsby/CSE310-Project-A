using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.DocumentDto {
    public class CreateDocumentRequest {
        // metadata
        [Required(ErrorMessage = "Name is required")]
        [StringLength(250, MinimumLength = 5)]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(5000, MinimumLength = 10)]
        public string Description { get; set; } = null!;

        [Range(0, int.MaxValue, ErrorMessage ="Minimum price is 0 (Free)")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "UniversityId is required")]
        [Range(1, int.MaxValue)]
        public int UniversityId { get; set; }

        [Required(ErrorMessage = "SubjectId is required")]
        [Range(1, int.MaxValue)]
        public int SubjectId { get; set; }

        // uploads (multipart/form-data)
        [Required(ErrorMessage = "You must upload at least one image.")]
        [MinLength(1, ErrorMessage = "You must upload at least one image.")]
        public List<IFormFile> Images { get; set; } = new();

        [Required(ErrorMessage = "You must upload at least one file.")]
        [MinLength(1, ErrorMessage = "You must upload at least one file.")]
        public List<IFormFile> Files { get; set; } = new();
    }
}