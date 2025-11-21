namespace project2.DTOs.UserPurchaseDto
{
    public class UserPurchaseDto
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public int DocumentId { get; set; }
        public string DocumentName { get; set; } = null!;
        public decimal PricePaid { get; set; }
        public DateTime PurchasedAt { get; set; }
    }
}
