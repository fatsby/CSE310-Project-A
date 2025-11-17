using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace project2.Models
{
    public class AppUser : IdentityUser
    {
        [Precision(18, 2)]
        public decimal Balance { get; set; }

        public List<Review> Reviews { get; set; } = new();

        public List<Document> CreatedDocuments { get; set; } = new();
    }
}
