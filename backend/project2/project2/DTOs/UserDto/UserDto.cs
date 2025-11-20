namespace project2.DTOs.UserDto {
    public class UserDto {
        public string Id { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public decimal Balance { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
