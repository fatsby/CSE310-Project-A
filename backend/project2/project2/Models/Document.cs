using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace project2.Models {
    public class Document {
        public int Id { get; set; }

        [Required]
        public string AuthorId { get; set; } = null!;        // link to AppUser

        [Required]
        [StringLength(250)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(5000)]
        public string Description { get; set; } = null!;

        [Precision(18, 2)]
        public decimal Price { get; set; } // 0 => free

        // relationships
        public int UniversityId { get; set; }
        public University University { get; set; } = null!;

        public int SubjectId { get; set; }
        public Subject Subject { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool isActive { get; set; } = true;
        public bool isDeleted { get; set; } = false;

        public List<DocumentImage> Images { get; set; } = new();
        public List<DocumentFile> Files { get; set; } = new();
    }
}