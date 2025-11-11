using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace project2.Models {
    [Index(nameof(IsActive), nameof(ExpiryDate))]
    public class Coupon {
        [Key]
        [StringLength(50)]
        public string Code { get; set; } = null!;

        [Precision(18, 2)]
        public decimal DiscountPercentage { get; set; }

        public DateTime ExpiryDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
