using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace project2.Models {
    public class Document {
        public int Id { get; set; }

        [Required]
        public string AuthorId { get; set; } = null!;        // link to AppUser
        public AppUser Author { get; set; } = null!;

        [Required]
        [StringLength(250)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(5000)]
        public string Description { get; set; } = null!;

        [Precision(18, 2)]
        public decimal Price { get; set; } // 0 => free

        public int purchaseCount { get; set; } = 0;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // relationships
        public int UniversityId { get; set; }
        public University University { get; set; } = null!;

        public int SubjectId { get; set; }
        public Subject Subject { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool isActive { get; set; } = true;
        public bool isDeleted { get; set; } = true;

        //total reviews count and average rating
        public int ReviewCount { get; set; } = 0;
        [Precision(3, 2)] // stores a value like X.XX (4.25)
        public decimal AverageRating { get; set; } = 0;

        //nav properties
        public List<DocumentImage> Images { get; set; } = new();
        public List<DocumentFile> Files { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
    }
}