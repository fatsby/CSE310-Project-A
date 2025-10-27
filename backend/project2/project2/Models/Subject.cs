namespace project2.Models {
    public class Subject {
        public int Id { get; set; } // ✅ Primary Key
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;

        public int UniversityId { get; set; }
        public University University { get; set; } = null!;

        public List<Document> Documents { get; set; } = new();

        public Subject() { }
        public Subject(string name, string code, University university) {
            Name = name;
            Code = code;
            University = university;
        }
    }
}
