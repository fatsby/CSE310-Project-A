using System.ComponentModel.DataAnnotations;

namespace project2.DTOs {
    public class PurchaseRequest {
        [Required]
        [MinLength(1)]
        public List<int> DocumentIds { get; set; } = new();
        public string? CouponCode { get; set; }
    }
}
