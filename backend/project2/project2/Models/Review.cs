using System.ComponentModel.DataAnnotations;

namespace project2.Models {
    public class Review {
        //this mf uses composite primary key made of UserId + DocumentId
        //configured in AppDbContext

        //foreign key, user who wrote the review
        public string UserId { get; set; } = null!;

        //fk, document being reviewed
        public int DocumentId { get; set; }

        //star rating system (1-5)
        [Range(1, 5)]
        public int Rating { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;


        [Required]
        [StringLength(2000)]
        public string Comment { get; set; } = null!;


        //nav properties
        public AppUser User { get; set; } = null!;
        public Document Document { get; set; } = null!;
    }
}
