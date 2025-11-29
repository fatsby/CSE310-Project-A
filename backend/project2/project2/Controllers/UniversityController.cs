using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.SubjectDto;
using project2.DTOs.UniversityDto;
using project2.Models;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UniversityController(AppDbContext db)
        {
            _db = db;
        }

        //Get all University name and id

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UniversityReadDto>>> GetAllUniversities()
        {
            var universities = await _db.Universities
                .AsNoTracking()
                .Select(u => new UniversityReadDto
                {
                    Id = u.Id,
                    Name = u.Name,
                }).ToListAsync();

            return Ok(universities);
        }

        //Get all Subjects by University id

        [HttpGet("{id}/subject")]
        public async Task<ActionResult> GetSubjectsByUniversityId(int id)
        {
            var subjects = await _db.Subjects
                .AsNoTracking()
                .Where(s => s.UniversityId == id)
                .Select(s => new SubjectReadDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    UniversityId = s.UniversityId,
                    Code = s.Code
                })
                .ToListAsync();
            return Ok(subjects);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateUniversity([FromBody] CreateUniversityDTO dto)
        {
            var uniExists = await _db.Universities.AnyAsync(u => u.Suffix == dto.Suffix);
            if (uniExists)
            {
                return NotFound(new { message = "University already exists" });
            }

            var university = new University(dto.Name, dto.Suffix);
            _db.Universities.Add(university);
            await _db.SaveChangesAsync();
            return Ok(new { university.Id, university.Name, university.Suffix });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUniversityName(int id, [FromBody] CreateUniversityDTO dto)
        {
            var uni = await _db.Universities.FindAsync(id);
            if (uni == null)
            {
                return NotFound();
            }

            uni.Name = dto.Name;
            uni.Suffix = dto.Suffix;

            await _db.SaveChangesAsync();

            return Ok(uni);
        }
    }
}