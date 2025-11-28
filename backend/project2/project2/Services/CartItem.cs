namespace project2.Models
{
    using System.ComponentModel.DataAnnotations;
    public class CartItem
    {
        [Required]
        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;

        [Required]
        public int DocumentId { get; set; }
        public Document Document { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}