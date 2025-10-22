namespace project2.DTOs {
    public class CreateDocumentRequest {
        // metadata
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal? Price { get; set; }
        public string University { get; set; } = null!;
        public string Subject { get; set; } = null!;

        // uploads (multipart/form-data)
        public List<IFormFile> Images { get; set; } = new(); // 1..5
        public List<IFormFile> Files { get; set; } = new();  // 0..N
    }

    public class DocumentResponse {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal? Price { get; set; }
        public string University { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public IEnumerable<string> Images { get; set; } = Enumerable.Empty<string>();
        public IEnumerable<(int fileId, string fileName, long sizeBytes)> Files { get; set; } = Enumerable.Empty<(int, string, long)>();
    }
}
