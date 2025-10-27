using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project2.Data;
using project2.DTOs;
using project2.Services;

namespace project2.Controllers {
    [Route("api/documents")]
    [ApiController]
    public class DocumentsController : ControllerBase {
        private readonly IDocumentService _svc;

        public DocumentsController(IDocumentService svc) => _svc = svc;

        // Create with metadata + files via multipart/form-data
        [HttpPost]
        [Authorize] // require login
        [RequestSizeLimit(150_000_000)] // 150MB per request (adjust)
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<DocumentResponse>> Create([FromForm] CreateDocumentRequest req, CancellationToken ct) {
            // get current user id from claims
            var authorId = int.Parse(User.FindFirst("sub")!.Value); // or your claim
            var result = await _svc.CreateAsync(authorId, req, ct);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // Basic fetch (metadata + public image URLs, file ids/names)
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<DocumentResponse>> Get([FromRoute] int id, [FromServices] AppDbContext db) {
            var doc = await db.Documents
                .Include(d => d.Images)
                .Include(d => d.Files)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doc is null) return NotFound();

            return new DocumentResponse {
                Id = doc.Id,
                Name = doc.Name,
                Description = doc.Description,
                Price = doc.Price,
                UniversityId = doc.UniversityId,
                UniversityName = doc.University.Name,
                SubjectId = doc.SubjectId,
                SubjectName = doc.Subject.Name,
                Images = doc.Images.OrderBy(i => i.SortOrder).Select(i => i.Url),
                Files = doc.Files.Select(f => (f.Id, f.FileName, f.SizeBytes))
            };
        }

        // Protected download (streams the file after authorization)
        [HttpGet("{id:int}/files/{fileId:int}/download")]
        [Authorize] // Only signed-in; inside service check purchase/ownership
        public async Task<IActionResult> Download(int id, int fileId, CancellationToken ct) {
            var userId = int.Parse(User.FindFirst("sub")!.Value);
            var result = await _svc.OpenFileForDownloadAsync(id, fileId, userId, ct);
            if (result is null) return NotFound();

            var (stream, contentType, downloadName) = result.Value;
            return File(stream, contentType, downloadName, enableRangeProcessing: true);
        }
    }
}
