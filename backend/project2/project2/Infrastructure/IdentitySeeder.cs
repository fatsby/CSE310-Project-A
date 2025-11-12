namespace project2.Infrastructure
{
    // Infrastructure/IdentitySeeder.cs
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using project2.Data;
    using project2.Models;

    public static class IdentitySeeder
    {
        public static async Task SeedIdentityAsync(this IServiceProvider sp, IConfiguration cfg)
        {
            using var scope = sp.CreateScope();
            var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await db.Database.MigrateAsync();

            // Ensure roles exist
            var roles = new[] { "Admin", "User" };
            foreach (var r in roles)
            {
                if (!await roleMgr.RoleExistsAsync(r))
                    await roleMgr.CreateAsync(new IdentityRole(r));
            }

            // Seed default admin
            var adminUserName = cfg["Seed:AdminUserName"] ?? "admin";
            var adminEmail = cfg["Seed:AdminEmail"] ?? "admin@example.com";
            var adminPwd = cfg["Seed:AdminPassword"] ?? "Admin@12345";
            var adminBalance = cfg["Seed:AdminBalance"];
            var admin = await userMgr.FindByEmailAsync(adminEmail);
            if (!string.IsNullOrWhiteSpace(adminEmail))
            {
                if (admin is null)
                {
                    admin = new AppUser
                    {
                        UserName = adminUserName,
                        Email = adminEmail,
                        EmailConfirmed = true,
                        Balance = decimal.TryParse(adminBalance, out var ab) ? ab : 0
                    };
                    var create = await userMgr.CreateAsync(admin, adminPwd);
                    if (create.Succeeded)
                        await userMgr.AddToRoleAsync(admin, "Admin");
                }
            }

            // Seed a User account for testing
            var userName = cfg["Seed:UserName"] ?? "TestUser";
            var userEmail = cfg["Seed:UserEmail"] ?? "user@example.com";
            var userPwd = cfg["Seed:UserPassword"] ?? "User@12345";
            var userBalance = cfg["Seed:UserBalance"];
            var userAcc = await userMgr.FindByEmailAsync(userEmail);
            if (userAcc is null)
            {
                userAcc = new AppUser
                {
                    UserName = userName,
                    Email = userEmail,
                    Balance = decimal.TryParse(userBalance, out var ub) ? ub : 0,
                    EmailConfirmed = true
                };
                var create = await userMgr.CreateAsync(userAcc, userPwd);
                if (create.Succeeded)
                    await userMgr.AddToRoleAsync(userAcc, "User");
            }
        }
    }
}
