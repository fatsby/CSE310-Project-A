namespace project2.Models {
    public class University {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Suffix { get; set; } = null!;

        public List<Subject> Subjects { get; set; } = new();

        public University() { }
        public University(string name, string suffix) {
            Name = name;
            Suffix = suffix;
        }
    }
}
