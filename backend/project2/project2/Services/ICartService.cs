using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace project2.Services {
    public interface ICartService {
        Task AddToCartAsync(string userId, int documentId, CancellationToken ct);
        Task RemoveFromCartAsync(string userId, int documentId, CancellationToken ct);
    }
}