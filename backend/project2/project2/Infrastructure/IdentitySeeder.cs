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

            // Seed documents
            if (admin != null && !await db.Documents.AnyAsync(d => d.Id == 1)) {
                var uni = await db.Universities.FindAsync(1);
                var subject = await db.Subjects.FindAsync(2);

                if (uni != null && subject != null) {
                    var doc = new Document {
                        Id = 1, // Manually set ID
                        AuthorId = admin.Id, // Use the real Admin ID
                        Name = "Cửu Âm Chân Kinh CSE201",
                        Description = "Tất tần tật về môn CSE201, Lab Files, Slides, Giải thuật và bí kíp.",
                        Price = 200000m,
                        UniversityId = 1, // EIU
                        SubjectId = 2,    // DSA CSE201
                        CreatedAt = new DateTime(2025, 1, 15, 10, 30, 0, DateTimeKind.Utc)
                    };
                    db.Documents.Add(doc);

                    db.DocumentImages.Add(new DocumentImage {
                        Id = 1,
                        DocumentId = 1,
                        Url = "/uploads/documents/1/images/fa54248d192b4c0eb1b2539f11ec6bfd.jpg",
                        StoragePath = "uploads/documents/1/images/fa54248d192b4c0eb1b2539f11ec6bfd.jpg",
                        SortOrder = 0
                    });

                    db.DocumentFiles.Add(new DocumentFile {
                        Id = 1,
                        DocumentId = 1,
                        FileName = "fbdd87ab3b4740b2a520dd5ed6e9259e.pdf",
                        ContentType = "application/pdf",
                        SizeBytes = 166831, // REAL FILE SIZE IN BYTES!!!!
                        Url = "/uploads/documents/1/files/fbdd87ab3b4740b2a520dd5ed6e9259e.pdf",
                        StoragePath = "uploads/documents/1/files/fbdd87ab3b4740b2a520dd5ed6e9259e.pdf",
                    });

                    await db.SaveChangesAsync();
                }
            }
        }
    }
}
