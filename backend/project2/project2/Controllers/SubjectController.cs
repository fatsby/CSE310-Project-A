using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project2.Data;
using project2.DTOs.SubjectDto;
using project2.Models;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase {
        private readonly AppDbContext _db;

        public SubjectController(AppDbContext db) {
            _db = db;
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateSubject([FromBody] CreateSubjectDTO dto) {
            var subject = new Subject(dto.Name, dto.UniversityId);
            _db.Subjects.Add(subject);
            await _db.SaveChangesAsync();
            return Ok(new { subject.Id, subject.Name, subject.UniversityId });
        }
    }
}
