namespace project2.DTOs
{
    public record CustomRegisterRequest(
    string Email,
    string Password,
    decimal? Balance
);
}
