namespace project2.Models {
    public class Subject {
        public string Name { get; set; }
        public string Code { get; set; }
        public University University { get; set; }

        public Subject(string name, string code, University university) {
            Name = name;
            Code = code;
            University = university;
        }
    }
}
