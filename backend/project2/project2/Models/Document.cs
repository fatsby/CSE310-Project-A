namespace project2.Models {
    public class Document {
        public int Id { get; set; }
        public int AuthorId { get; set; }           // Link to AppUser
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal? Price { get; set; }         // null or 0 => free
        public string University { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<DocumentImage> Images { get; set; } = new();
        public List<DocumentFile> Files { get; set; } = new();
    }
}
