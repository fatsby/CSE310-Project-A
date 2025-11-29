using System;
using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.UniversityDto;

public class UpdateSubjectDTO
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Code { get; set; }

}
