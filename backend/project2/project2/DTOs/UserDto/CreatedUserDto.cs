using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.UserDto
{
    public class CreatedUserDto
    {
        [Required]
        [MaxLength(265, ErrorMessage = "Username cannot be over 265 characters")]
        [MinLength(1, ErrorMessage = "Username cannot be under 1 character")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
