using System.ComponentModel.DataAnnotations;

namespace project2.DTOs.UserDto
{
    public class UpdatedUserDto
    {
        [MaxLength(265, ErrorMessage = "Username cannot be over 265 characters")]
        [MinLength(1, ErrorMessage = "Username cannot be under 1 character")]
        public string? Username { get; set; } = string.Empty;

        public string? Password { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = string.Empty;
    }
}
