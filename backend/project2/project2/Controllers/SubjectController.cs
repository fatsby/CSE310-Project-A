using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project2.Data;
using project2.DTOs.SubjectDto;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly AppDbContext _db;
        
        public SubjectController(AppDbContext db)
        {
            _db = db;
        }
    }
}
