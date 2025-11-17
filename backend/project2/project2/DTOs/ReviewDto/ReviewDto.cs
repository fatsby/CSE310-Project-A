namespace project2.DTOs.ReviewDto {
    public class ReviewDto {
        public string UserId { get; set; } = null!;
        public string? UserName { get; set; }
        public int DocumentId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}
