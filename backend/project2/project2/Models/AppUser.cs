using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace project2.Models
{
    public class AppUser : IdentityUser
    {
        [Precision(18, 2)]
        public decimal Balance { get; set; }
    }
}
