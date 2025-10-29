using System.ComponentModel.DataAnnotations.Schema;

namespace project2.Models {
    public class UserPurchase {
        public string UserId { get; set; } = null!;
        public int DocumentId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePaid { get; set; }
        public DateTime PurchasedAt { get; set; }

        public AppUser User { get; set; } = null!;
        public Document Document { get; set; } = null!;
    }
}
