namespace project2.Models {
    public class DocumentFile {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public Document Document { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = "application/octet-stream";
        public long SizeBytes { get; set; }
        public string StoragePath { get; set; } = null!;
        public long DownloadCount { get; set; }
    }
}
