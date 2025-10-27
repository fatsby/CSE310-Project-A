namespace project2.DTOs {
    public class CreateDocumentRequest {
        // metadata
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal? Price { get; set; }
        public int UniversityId { get; set; }
        public int SubjectId { get; set; }

        // uploads (multipart/form-data)
        public List<IFormFile> Images { get; set; } = new(); // 1..5
        public List<IFormFile> Files { get; set; } = new();  // 1..N
    }
}
