namespace project2.DTOs.DocumentDto {
    public class DocumentFileDto {
        public int Id { get; set; }
        public string FileName { get; set; } = null!;
        public long SizeBytes { get; set; }
    }   
}
