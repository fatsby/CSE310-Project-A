using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.UserDto;
using project2.Models;

namespace project2.Controllers
{
    [Route("api/admin/users")]
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

        // EditUse still being reviewed
        // after editting, we cannot log in by the new username & password (using Swagger). BUT IN MY OTHER PROJECT, I CAN
        [HttpPut("{id}")]
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
