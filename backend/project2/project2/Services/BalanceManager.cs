using Microsoft.EntityFrameworkCore;
using project2.Data;

namespace project2.Services {
    public class BalanceManager : IBalanceManager {
        private readonly AppDbContext _db;

        public BalanceManager(AppDbContext db) {
            _db = db;
        }

        public async Task TransferAsync(string senderId, decimal totalCost, Dictionary<string, decimal> recipients, CancellationToken ct) {
            // 1. Get Buyer
            var buyer = await _db.Users
                    .FirstOrDefaultAsync(u => u.Id == senderId, ct);
            if (buyer is null)
                throw new KeyNotFoundException("Buyer account not found.");

            // 2. Validate
            if (buyer.Balance < totalCost)
                throw new InvalidOperationException($"Insufficient funds. Total: {totalCost:C}, Your Balance: {buyer.Balance:C}");

            // 3. Execute transfer

            // a) Subtract from buyer
            buyer.Balance -= totalCost;

            // b) Get all authors
            var authorIds = recipients.Keys;
            var authors = await _db.Users
                .Where(u => authorIds.Contains(u.Id))
                .ToListAsync(ct);

            // c) Add to authors
            foreach (var author in authors) {
                if (recipients.TryGetValue(author.Id, out var payout)) {
                    author.Balance += payout;
                }
            }

            // 4. Save Changes
            // this is called inside the DocumentService's transaction,
            // this SaveChangesAsync() call is part of that same atomic operation.
            await _db.SaveChangesAsync(ct);
        }
    }
}
