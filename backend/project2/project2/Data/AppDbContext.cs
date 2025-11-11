namespace project2.Data
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using project2.Models;

    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public DbSet<University> Universities => Set<University>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<DocumentImage> DocumentImages => Set<DocumentImage>();
        public DbSet<DocumentFile> DocumentFiles => Set<DocumentFile>();

        public DbSet<UserPurchase> UserPurchases => Set<UserPurchase>();
        public DbSet<Coupon> Coupons => Set<Coupon>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder b) {
            base.OnModelCreating(b);

            // Decimal precision
            b.Entity<Document>(e =>
            {
                e.Property(p => p.Price).HasPrecision(18, 2);

                e.HasOne(d => d.University)
                    .WithMany()
                    .HasForeignKey(d => d.UniversityId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(d => d.Subject)
                    .WithMany(s => s.Documents)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            b.Entity<Subject>(e =>
            {
                e.HasOne(s => s.University)
                    .WithMany(u => u.Subjects)
                    .HasForeignKey(s => s.UniversityId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            b.Entity<DocumentImage>(e =>
            {
                e.HasIndex(x => new { x.DocumentId, x.SortOrder }).IsUnique();
            });

            b.Entity<Document>()
                .HasMany(d => d.Images)
                .WithOne(i => i.Document)
                .HasForeignKey(i => i.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Entity<Document>()
                .HasMany(d => d.Files)
                .WithOne(f => f.Document)
                .HasForeignKey(f => f.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Entity<Coupon>(e => {
                e.Property(c => c.DiscountPercentage).HasPrecision(18, 2);
            });
            //UserPurchase relationships
            b.Entity<UserPurchase>()
            .HasKey(p => new { p.UserId, p.DocumentId });

            // Configure relationships
            b.Entity<UserPurchase>()
                .HasOne(p => p.User)
                .WithMany() // Or add 'List<UserPurchase> Purchases' to AppUser
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<UserPurchase>()
                .HasOne(p => p.Document)
                .WithMany() // Or add 'List<UserPurchase> Purchases' to Document
                .HasForeignKey(p => p.DocumentId)
                .OnDelete(DeleteBehavior.Restrict);



            //Seed data
            b.Entity<University>().HasData(
                new University { Id = 1, Name = "Eastern International University", Suffix = "EIU" },
                new University { Id = 2, Name = "Ho Chi Minh University of Technology", Suffix = "HCMUT" }
            );

            b.Entity<Subject>().HasData(
                new Subject { Id = 1, Name = "Operating Systems", Code = "CSE302", UniversityId = 1 },
                new Subject { Id = 2, Name = "Database Systems", Code = "CSE301", UniversityId = 1 },
                new Subject { Id = 3, Name = "Data Structures and Algorithms", Code = "CSE201", UniversityId = 2 }
            );
        }

    }
}
