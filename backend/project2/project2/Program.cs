using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs;
using project2.Files;
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
    .AddDefaultTokenProviders();

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

builder.Services.AddDataProtection();
builder.Services.AddSingleton(TimeProvider.System);


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



// A secure endpoint to get info about the current user
app.MapGet("/me", (ClaimsPrincipal me) => new {
    name = me.Identity?.Name,
    claims = me.Claims.Select(c => new { c.Type, c.Value })
}).RequireAuthorization();

app.MapControllers();

// Local files storage
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IFileStorage, LocalFileStorage>();
app.UseStaticFiles(); // serve wwwroot/uploads


await app.Services.SeedIdentityAsync(builder.Configuration);

app.Run();
