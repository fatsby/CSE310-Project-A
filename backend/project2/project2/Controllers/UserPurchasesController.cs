using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.UserPurchaseDto;
using System.Security.Claims;

namespace project2.Controllers {
    [Route("api/purchases")]
    [ApiController]
    public class UserPurchasesController : ControllerBase {
        private readonly AppDbContext _db;

        public UserPurchasesController(AppDbContext db) {
            _db = db;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPurchases() {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found.");

            var purchases = await _db.UserPurchases.AsNoTracking().Where(u => u.UserId == userId)
                //.Include(d => d.Document) //too large to include
                //.Include(d => d.User)
                .ToListAsync();
            if (purchases == null || purchases.Count == 0) {
                return NotFound("No purchases found for this user.");
            }

            return Ok(purchases);
        }

        [HttpGet("{documentId}")]
        [Authorize]
        public async Task<IActionResult> GetPurchaseByDocumentId(int documentId) {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found.");
            var purchase = await _db.UserPurchases
                .AsNoTracking()
                .Where(u => u.UserId == userId && u.DocumentId == documentId)
                //.Include(d => d.Document) //too large to include
                //.Include(d => d.User)
                .FirstOrDefaultAsync();
            if (purchase == null) {
                return NotFound("Purchase not found for this document.");
            }
            return Ok(purchase);
        }

        [HttpGet("totalSales")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTotalSales() {
            var purchasesList = await _db.UserPurchases.AsNoTracking().ToListAsync();
            
            var totalSales = purchasesList.Sum(p => p.PricePaid);

            return Ok(totalSales);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserPurchaseDto>>> GetAllPurchases(CancellationToken ct)
        {

            var purchases = await _db.UserPurchases
                .AsNoTracking()
                .OrderByDescending(p => p.PurchasedAt)
                .Select(p => new UserPurchaseDto
                {
                    UserId = p.UserId,
                    UserName = p.User.UserName ?? "Unknown",
                    DocumentId = p.DocumentId,
                    DocumentName = p.Document.Name,
                    PricePaid = p.PricePaid,
                    PurchasedAt = p.PurchasedAt
                })
                .ToListAsync(ct);

            if (purchases.Count == 0)
            {
                return Ok(new List<UserPurchaseDto>());
            }

            return Ok(purchases);
        }
    }
}
