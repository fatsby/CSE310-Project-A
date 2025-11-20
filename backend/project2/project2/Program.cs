using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using project2.Data;
using project2.DTOs;
using project2.Files;
using project2.Infrastructure;
using project2.Models;
using project2.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

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

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") //Frontend port
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials(); 
                      });
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("v1", new OpenApiInfo {
        Title = "Gradelevate API",
        Version = "v1",
        Description = "Gradelevate / Project-B backend API"
    });

    //Add Bearer token authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your access token here, just paste the token"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDataProtection();
builder.Services.AddSingleton(TimeProvider.System);
// Local files storage
builder.Services.AddHttpContextAccessor();

// services
builder.Services.AddScoped<IFileStorage, LocalFileStorage>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IBalanceManager, BalanceManager>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

//for debugging purposes only - log sensitive data
builder.Services.AddDbContext<AppDbContext>(opt => {
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
    opt.EnableSensitiveDataLogging(); // DEV ONLY
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

await app.Services.SeedIdentityAsync(builder.Configuration);

app.Run();
