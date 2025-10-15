using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using project2.DTOs;
using project2.Models;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly SignInManager<AppUser> _signIn;
    private readonly RoleManager<IdentityRole> _roles;

    public AuthController(UserManager<AppUser> users, SignInManager<AppUser> signIn, RoleManager<IdentityRole> roles)
    {
        _users = users; _signIn = signIn; _roles = roles;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IResult> Register([FromBody] RegisterDTO dto)
    {
        var user = new AppUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
            Balance = 0m //default balance
        };

        var create = await _users.CreateAsync(user, dto.Password);
        if (!create.Succeeded) return Results.BadRequest(create.Errors);

        if (!await _roles.RoleExistsAsync("User"))
            await _roles.CreateAsync(new IdentityRole("User"));
        await _users.AddToRoleAsync(user, "User");

        // returns token
        var principal = await _signIn.CreateUserPrincipalAsync(user);
        await HttpContext.SignInAsync(IdentityConstants.BearerScheme, principal);

        // bearer token is already written in the principal above, no need to do anything else
        return Results.Empty;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IResult> Login([FromBody] LoginDTO dto)
    {
        // find user by email only
        var user = await _users.FindByEmailAsync(dto.Email);
        if (user is null) return Results.Unauthorized();

        var check = await _signIn.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: true);
        if (!check.Succeeded) return Results.Unauthorized();

        var principal = await _signIn.CreateUserPrincipalAsync(user);
        await HttpContext.SignInAsync(IdentityConstants.BearerScheme, principal);

        return Results.Empty;
    }
}

