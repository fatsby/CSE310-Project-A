using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<ActionResult> CreateSubject([FromBody] CreateSubjectDTO dto)
        {
            var uniExists = await _db.Universities.AnyAsync(u => u.Id == dto.UniversityId);
            if (!uniExists)
            {
                return NotFound(new { message = "University not found." });
            }

            var subjectExists = await _db.Subjects.AnyAsync(s =>
                s.UniversityId == dto.UniversityId &&
                s.Code == dto.Code);

            if (subjectExists)
            {
                return BadRequest(new { message = "A subject with this Code already exists for this University." });
            }

            var subject = new Subject(dto.Name, dto.Code, dto.UniversityId);
            _db.Subjects.Add(subject);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubjectById), new { id = subject.Id }, new
            {
                subject.Id,
                subject.Name,
                subject.Code,
                subject.UniversityId
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetSubjectById(int id)
        {
            var sub = await _db.Subjects.FindAsync(id);
            return sub == null ? NotFound() : Ok(sub);
        }
    }
}
