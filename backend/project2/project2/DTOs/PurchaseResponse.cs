namespace project2.DTOs {
    public class PurchaseResponse {
        public int ItemsPurchased { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountApplied { get; set; }
        public decimal TotalPricePaid { get; set; }
        public decimal NewUserBalance { get; set; }
        public List<int> PurchasedDocumentIds { get; set; } = new();
    }
}
