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

            var userDTO = new {
                user.UserName,
                user.Balance,
                user.Email,
                user.IsActive,
                user.AvatarUrl
            };

            return Ok(userDTO);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            // join tables Users + UserRoles + Roles => take user, roleName
            var userWithROles = await (from u in _context.Users
                                       join ur in _context.UserRoles on u.Id equals ur.UserId
                                       join r in _context.Roles on ur.RoleId equals r.Id
                                       select new { User = u, RoleName = r.Name }
                                       ).ToListAsync();

            return Ok(userWithROles);
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

        // add IsBanned -> run migrations
        // toggle ban (banned -> unbanned, unbanned -> banned)
        [HttpPut("ban/{id}")]
        public async Task<IActionResult> BanUser([FromRoute] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            //user.IsBanned = !user.IsBanned;
            //await _context.SaveChangesAsync();

            //var status = user.IsBanned ? "banned" : "unbanned";

            //return Ok(new { message = $"User {user.UserName} has been {status}." });
            return Ok();
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
