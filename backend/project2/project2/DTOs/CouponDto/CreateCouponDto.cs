using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.CouponDto {
    public class CreateCouponDto {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Code { get; set; } = null!;

        [Range(1, 100)]
        public decimal DiscountPercentage { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }
    }
}
