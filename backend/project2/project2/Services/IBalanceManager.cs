namespace project2.Services {
    public interface IBalanceManager {
        /// <summary>
        /// Validates a buyer's balance and executes the multi-party transfer.
        /// This method assumes it is being run inside an existing DbContext transaction.
        /// </summary>
        /// <param name="senderId">The ID of the user spending money.</param>
        /// <param name="totalCost">The total amount to be debited from the buyer.</param>
        /// <param name="recipients">A dictionary where Key is AuthorId and Value is the amount to be credited.</param>
        /// <param name="ct">Cancellation token.</param>
        /// <exception cref="InvalidOperationException">Thrown if the buyer has insufficient funds.</exception>
        /// <exception cref="KeyNotFoundException">Thrown if the buyer or an author is not found.</exception>
        Task TransferAsync(string senderId, decimal totalCost, Dictionary<string, decimal> recipients, CancellationToken ct);
    }
}
