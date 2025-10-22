namespace project2.Models {
    public class DocumentImage {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public Document Document { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string StoragePath { get; set; } = null!;   // for deletion
        public int SortOrder { get; set; }                 // 0..4
    }
}
