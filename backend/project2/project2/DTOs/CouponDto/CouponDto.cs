using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.CouponDto {
    public class CouponDto {
        public string Code { get; set; } = null!;
        public decimal DiscountPercentage { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}
