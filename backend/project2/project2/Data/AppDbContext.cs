namespace project2.Data
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using project2.Models;

    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<DocumentImage> DocumentImages => Set<DocumentImage>();
        public DbSet<DocumentFile> DocumentFiles => Set<DocumentFile>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder b) {
            b.Entity<Document>(e =>
            {
                e.Property(p => p.Name).HasMaxLength(200).IsRequired();
                e.Property(p => p.Subject).HasMaxLength(50).IsRequired();
                e.Property(p => p.University).HasMaxLength(150).IsRequired();
            });

            b.Entity<DocumentImage>(e =>
            {
                e.HasIndex(x => new { x.DocumentId, x.SortOrder }).IsUnique();
            });

            // Relationships
            //One-to-Many: Document -> DocumentImages, cascade delete
            b.Entity<Document>()
                .HasMany(d => d.Images)
                .WithOne(i => i.Document)
                .HasForeignKey(i => i.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            //One-to-Many: Document -> DocumentFiles, cascade delete
            b.Entity<Document>()
                .HasMany(d => d.Files)
                .WithOne(f => f.Document)
                .HasForeignKey(f => f.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
