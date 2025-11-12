namespace project2.DTOs.DocumentDto {
    public class DocumentResponse {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal? Price { get; set; }

        // Related entities
        public int UniversityId { get; set; }
        public string UniversityName { get; set; } = null!;
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;

        public IEnumerable<string> Images { get; set; } = Enumerable.Empty<string>();
        public IEnumerable<DocumentFileDto> Files { get; set; } = Enumerable.Empty<DocumentFileDto>();
    }
}
