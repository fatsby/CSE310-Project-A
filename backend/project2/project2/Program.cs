using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs;
using project2.Infrastructure;
using project2.Models;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

//EF Core
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", p => p.RequireRole("Admin"));
});

//Identity Core
builder.Services
    .AddIdentityCore<AppUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()                   // <-- roles support
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddApiEndpoints();                         // <-- enables MapIdentityApi<AppUser>()

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = IdentityConstants.BearerScheme;
        options.DefaultAuthenticateScheme = IdentityConstants.BearerScheme;
        options.DefaultChallengeScheme = IdentityConstants.BearerScheme;
    })
    .AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

var auth = app.MapGroup("/auth"); // all auth endpoints will be prefixed with /auth

auth.MapPost("/reg", async (
    UserManager<AppUser> userMgr,
    RoleManager<IdentityRole> roleMgr,
    CustomRegisterRequest dto) =>
{
    // custom user registration logic
    var user = new AppUser
    {
        UserName = dto.Email,
        Email = dto.Email,
        Balance = dto.Balance ?? 0m,  // default balance

        EmailConfirmed = false
    };

    var result = await userMgr.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
        return Results.BadRequest(result.Errors);

    if (!await roleMgr.RoleExistsAsync("User"))
        await roleMgr.CreateAsync(new IdentityRole("User"));

    var roleResult = await userMgr.AddToRoleAsync(user, "User");
    if (!roleResult.Succeeded)
        return Results.BadRequest(roleResult.Errors);

    return Results.Ok(new { message = "Registered successfully", userId = user.Id });
})
.WithName("CustomRegister")
.WithOrder(-1); // << Important: higher priority than the built-in /register endpoint

auth.MapIdentityApi<AppUser>(); // login, refresh, logout, mfa, reset password.

// A secure endpoint to get info about the current user
app.MapGet("/me", (ClaimsPrincipal me) => new {
    name = me.Identity?.Name,
    claims = me.Claims.Select(c => new { c.Type, c.Value })
}).RequireAuthorization();

app.MapControllers();

await app.Services.SeedIdentityAsync(builder.Configuration);

app.Run();
