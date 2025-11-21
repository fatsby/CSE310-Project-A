using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.SubjectDto {
    public class CreateSubjectDTO {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Code { get; set; } = null!;
        [Required]
        public int UniversityId { get; set; }
    }
}
