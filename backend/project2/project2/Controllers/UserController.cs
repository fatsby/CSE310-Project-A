using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.UserDto;
using project2.Models;
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

            var roles = _userManager.GetRolesAsync(user);

            var userDTO = new {
                user.Id,
                user.UserName,
                user.Balance,
                user.Email,
                user.IsActive,
                IsAdmin = roles.Result.Contains("Admin"),
                user.AvatarUrl
            };

            return Ok(userDTO);
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers() {
            var users = await _userManager.Users.ToListAsync();

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

        // i did token thing by a different method, so i dont understand this
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreatedUserDto createdUserDto)
        {
            // use try because while saving a new user, it could have errors like failed DB Connection, null _userManager (learned from youtube)
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var appUser = new AppUser
                {
                    UserName = createdUserDto.Username,
                    Email = createdUserDto.Email,
                    PhoneNumber = createdUserDto.PhoneNumber,
                };

                var createdUser = await _userManager.CreateAsync(appUser, createdUserDto.Password);

                if (createdUser.Succeeded)
                {
                    if (!await _roleManager.RoleExistsAsync("Admin"))
                        await _roleManager.CreateAsync(new IdentityRole("Admin"));
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "Admin");

                    if (roleResult.Succeeded)
                    {
                        return Ok(new NewUserDto
                        {
                            Username = appUser.UserName,
                            Email = appUser.Email,
                            PhoneNumber = appUser.PhoneNumber,
                            Token = "will be understood later"
                        }
                        );
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpGet("search-by-name")]
        public async Task<IActionResult> GetUsersByName(string nameInput)
        {
            var users = await _userManager.Users.Where(u => u.UserName.ToLower().Contains(nameInput.ToLower())).ToListAsync();

            if(users == null)
            {
                return NotFound("Username does not exist");
            }

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            if(string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var existingUser = await _userManager.FindByIdAsync(id);

            if (existingUser == null)
            {
                return NotFound(id);
            }

            return Ok(existingUser);
        }

        // EditUse still being reviewed
        // after editting, we cannot log in by the new username & password (using Swagger). BUT IN MY OTHER PROJECT, I CAN
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] UpdatedUserDto updatedUserDto)
        {
            var existingUser = await _userManager.FindByIdAsync(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                existingUser.UserName = updatedUserDto.Username;
                existingUser.Email = updatedUserDto.Email;
                existingUser.PhoneNumber = updatedUserDto.PhoneNumber;
                if (!string.IsNullOrEmpty(updatedUserDto.Password))
                {
                    var removingPasswordResult = await _userManager.RemovePasswordAsync(existingUser);
                    if (!removingPasswordResult.Succeeded)
                    {
                        return BadRequest(removingPasswordResult.Errors);
                    }

                    var addNewPasswordResult = await _userManager.AddPasswordAsync(existingUser, updatedUserDto.Password);
                    if (!addNewPasswordResult.Succeeded)
                    {
                        return BadRequest(addNewPasswordResult.Errors);
                    }
                }

                var updateUserResult = await _userManager.UpdateAsync(existingUser);
                if (!updateUserResult.Succeeded)
                {
                    return BadRequest(ModelState);
                }
            }

            return Ok(existingUser);
        }

        // i updated ban logic - tri
        [HttpPost("ban/{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<IResult> BanUser(string email) {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return Results.NotFound();

            user.IsActive = false;

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
