using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace project2.Services {
    public class CartService : ICartService {
        private readonly AppDbContext _db;

        public CartService(AppDbContext db) {
            _db = db;
        }

        public async Task AddToCartAsync(string userId, int documentId, CancellationToken ct) {
            // validate
            var document = await _db.Documents
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == documentId, ct);

            if (document == null || document.isDeleted || !document.isActive)
                throw new KeyNotFoundException("Document not found or is not available.");

            if (document.AuthorId == userId)
                throw new InvalidOperationException("You cannot add your own document to the cart.");

            // check already purchased
            var hasPurchased = await _db.UserPurchases
                .AnyAsync(p => p.UserId == userId && p.DocumentId == documentId, ct);

            if (hasPurchased)
                throw new InvalidOperationException("You have already purchased this document.");

            // check if already in cart
            var alreadyInCart = await _db.CartItems
                .AnyAsync(ci => ci.UserId == userId && ci.DocumentId == documentId, ct);

            if (alreadyInCart) {
                throw new InvalidOperationException("This item is already in your cart.");
            }

            // add to cart
            var cartItem = new CartItem {
                UserId = userId,
                DocumentId = documentId,
            };

            _db.CartItems.Add(cartItem);
            await _db.SaveChangesAsync(ct);
        }

        public async Task RemoveFromCartAsync(string userId, int documentId, CancellationToken ct) {
            var cartItem = await _db.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.DocumentId == documentId, ct);

            if (cartItem == null) {
                return;
            }

            _db.CartItems.Remove(cartItem);
            await _db.SaveChangesAsync(ct);
        }
    }
}