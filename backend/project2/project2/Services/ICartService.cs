using project2.DTOs.CartDto;

namespace project2.Services {
    public interface ICartService {
        Task AddToCartAsync(string userId, int documentId, CancellationToken ct);
        Task RemoveFromCartAsync(string userId, int documentId, CancellationToken ct);
        Task<IEnumerable<CartItemDto>> GetCartAsync(string userId, CancellationToken ct);
    
    }
}