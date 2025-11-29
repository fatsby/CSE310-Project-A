using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.UserDto;
using project2.Models;
using System.Data;
using System.Security.Claims;

namespace project2.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;

        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser() {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var roles = await _userManager.GetRolesAsync(user);

            var userDTO = new {
                user.Id,
                user.UserName,
                user.Balance,
                user.Email,
                user.IsActive,
                IsAdmin = roles.Contains("Admin"),
                user.AvatarUrl
            };

            return Ok(userDTO);
        }

        [HttpPatch("pfp")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture([FromBody] string url)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            user.AvatarUrl = url;

            await _userManager.UpdateAsync(user);

            return Ok();
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers() {
            var users = await _userManager.Users
                .AsNoTracking()
                .ToListAsync();

            var userDTOs = new List<object>();

            // loop through each user to populate the DTO
            foreach (var user in users) {
                var roles = await _userManager.GetRolesAsync(user);

                userDTOs.Add(new {
                    user.Id,
                    user.UserName,
                    user.Balance,
                    user.Email,
                    user.IsActive,
                    user.AvatarUrl,
                    IsAdmin = roles.Contains("Admin")
                });
            }

            return Ok(userDTOs);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(id);
            }

            var roles = await _userManager.GetRolesAsync(user);

            var userDTO = new
            {
                user.Id,
                user.UserName,
                user.Balance,
                user.Email,
                user.IsActive,
                IsAdmin = roles.Contains("Admin"),
                user.AvatarUrl
            };

            return Ok(userDTO);
        }

        [HttpPut("admin/edit/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] UpdatedUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("User not found.");

            var errors = new List<string>();

            // username change
            if (!string.IsNullOrWhiteSpace(dto.Username) && user.UserName != dto.Username) {
                //allows duplicate username because email and guid is unique (not sure if good idea)
                // use identity's method to update username
                var setUserNameResult = await _userManager.SetUserNameAsync(user, dto.Username);
                if (!setUserNameResult.Succeeded) {
                    errors.AddRange(setUserNameResult.Errors.Select(e => e.Description));
                }
            }

            // handle password change (admin override)
            if (!string.IsNullOrWhiteSpace(dto.Password)) {
                // remove current password
                if (await _userManager.HasPasswordAsync(user)) {
                    var removeResult = await _userManager.RemovePasswordAsync(user);
                    if (!removeResult.Succeeded) {
                        errors.AddRange(removeResult.Errors.Select(e => e.Description));
                    }
                }

                // add new password
                var addResult = await _userManager.AddPasswordAsync(user, dto.Password);
                if (!addResult.Succeeded) {
                    errors.AddRange(addResult.Errors.Select(e => e.Description));
                }
            }

            // handle avatar change (allow null for clearing avatar)
            //if (!string.IsNullOrEmpty(dto.AvatarUrl) && user.AvatarUrl != dto.AvatarUrl) {
            //    user.AvatarUrl = dto.AvatarUrl;
            //}
            user.AvatarUrl = dto.AvatarUrl;

            // save security stamp
            await _userManager.UpdateSecurityStampAsync(user);

            // save any custom property changes (avatar url)
            var finalUpdate = await _userManager.UpdateAsync(user);
            if (!finalUpdate.Succeeded) {
                errors.AddRange(finalUpdate.Errors.Select(e => e.Description));
            }

            if (errors.Count > 0) {
                return BadRequest(new { message = "Update failed", errors });
            }

            return Ok(new {
                message = "User updated successfully",
                user = new {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.AvatarUrl
                }
            });
        }

        // i updated ban logic - tri
        [HttpPost("admin/ban-switch/{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<IResult> BanSwitchUser(string email) {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return Results.NotFound();

            user.IsActive = !user.IsActive;

            // update the Security Stamp
            // invalidate the refresh token
            // they will not be able to get a new access token once the current one expires.
            await _userManager.UpdateSecurityStampAsync(user);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) return Results.BadRequest(result.Errors);

            return Results.Ok(new { message = "User banned and refresh token invalidated." });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            if(string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);

            if(user == null)
            {
                return NotFound();
            }

            var deleteResult = await _userManager.DeleteAsync(user);

            if (deleteResult == null)
            {
                return BadRequest("Delete failed.");
            }

            return NoContent();
        }

        // BanUser, CreateUser will be done later
    }
}
