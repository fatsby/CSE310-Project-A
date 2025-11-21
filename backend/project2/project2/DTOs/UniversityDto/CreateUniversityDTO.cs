using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.UniversityDto {
    public class CreateUniversityDTO {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Suffix { get; set; } = null!;
    }
}
