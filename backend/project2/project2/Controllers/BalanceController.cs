using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using project2.Services;
using project2.Models;
using System.Data;
using System.Security.Claims;
using project2.Data;

namespace project2.Controllers
{
    [Route("api/balance")]
    [ApiController]
    [Authorize]
    public class BalanceController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _db;


        public BalanceController(UserManager<AppUser> userManager, AppDbContext db)
        {
            this._userManager = userManager;
            this._db = db;
        }

        //these endpoints are very bad practices, we should put the logic in BalanceManager but we're running out of time and i'm lazy
        [HttpPost("deposit")]
        public async Task<IActionResult> DepositBalance([FromQuery] decimal amount, CancellationToken ct)
        {
            //simulate deposits
            if (amount <= 0) return BadRequest("Amount must be greater than 0.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            user.Balance += amount;

            await _userManager.UpdateAsync(user);

            return Ok();
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> WithdrawBalance([FromQuery] decimal amount, CancellationToken ct)
        {
            //simulate withdraw
            if (amount <= 0) return BadRequest("Amount must be greater than 0.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            user.Balance -= amount;

            await _userManager.UpdateAsync(user);

            return Ok();
        }
    }
}
