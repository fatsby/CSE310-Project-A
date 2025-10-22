namespace project2.Models {
    public class University {
        public string Name { get; set; }
        public string Suffix { get; set; }

        public University(string name, string suffix) { 
            Name = name;
            Suffix = suffix;
        }
    }
}
