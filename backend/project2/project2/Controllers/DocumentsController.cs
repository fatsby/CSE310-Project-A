using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs.DocumentDto;
using project2.Services;
using System.Security.Claims;

namespace project2.Controllers {
    [Route("api/documents")]
    [ApiController]
    public class DocumentsController : ControllerBase {
        private readonly IDocumentService _svc;
        private readonly AppDbContext _db;

        public DocumentsController(IDocumentService svc, AppDbContext db) {
            _svc = svc;
            _db = db;
        }

        [HttpPost("create")]
        [Authorize] // require login
        [RequestSizeLimit(150_000_000)] // 150MB per request
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<DocumentResponse>> Create([FromForm] CreateDocumentRequest req, CancellationToken ct) {
            // get current user id from claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            try {
                var result = await _svc.CreateAsync(userId, req, ct);
                return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
            } catch (KeyNotFoundException ex) {
                return NotFound(new { message = ex.Message });
            } catch (ArgumentException ex) {
                return BadRequest(new { message = ex.Message });
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<DocumentResponse>>> List(
            [FromQuery] int? subjectId,
            [FromQuery] string? authorId, // AuthorId is string bcuz UserId is GUID.ToString()
            [FromQuery] int? universityId,
            [FromQuery] string? courseTitle)
        {
            var query = _db.Documents
                .AsNoTracking()
                .Where(d => !d.isDeleted && d.isActive); // only show active and not deleted documents

            if (subjectId.HasValue) {
                query = query.Where(d => d.SubjectId == subjectId.Value);
            }
            if (universityId.HasValue) {
                query = query.Where(d => d.UniversityId == universityId.Value);
            }
            if (!string.IsNullOrEmpty(authorId)) {
                query = query.Where(d => d.AuthorId == authorId);
            }

            if (!string.IsNullOrEmpty(courseTitle)) {
                query = query.Where(d => d.Name.Contains(courseTitle));
            }

            var docs = await query
                .Include(d => d.University)
                .Include(d => d.Subject)
                .Include(d => d.Images)
                .Include(d => d.Files)
                .ToListAsync();

            // map the results to a DTO
            var response = docs.Select(doc => new DocumentResponse {
                Id = doc.Id,
                Name = doc.Name,
                Description = doc.Description,
                Price = doc.Price,
                UniversityId = doc.UniversityId,
                UniversityName = doc.University.Name,
                SubjectId = doc.SubjectId,
                SubjectName = doc.Subject.Name,
                isActive = doc.isActive,
                isDeleted = doc.isDeleted,
                Images = doc.Images.OrderBy(i => i.SortOrder).Select(i => i.Url),
                Files = doc.Files.Select(f => new DocumentFileDto {
                    Id = f.Id,
                    FileName = f.FileName,
                    SizeBytes = f.SizeBytes
                })
            });

            return Ok(response);
        }

        // Basic fetch
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<DocumentResponse>> Get([FromRoute] int id, CancellationToken ct) {
            var result = await _svc.GetDocumentResponseByIdAsync(id, ct);

            return (result is null) ? NotFound() : Ok(result);
        }

        // Protected download
        [HttpGet("{id:int}/files/{fileId:int}/download")]
        [Authorize]
        public async Task<IActionResult> Download(int id, int fileId, CancellationToken ct) {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            try {
                var result = await _svc.OpenFileForDownloadAsync(id, fileId, userId, ct);
                if (result is null) return NotFound();

                var (stream, contentType, downloadName) = result.Value;
                return File(stream, contentType, downloadName, enableRangeProcessing: true);
            } catch (UnauthorizedAccessException ex) {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); // 403 Forbidden
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An error occurred while processing the file.", details = ex.Message });
            }
        }

        [HttpPost("purchase")] //api/documents/purchase
        [Authorize]
        public async Task<ActionResult<PurchaseResponse>> PurchaseCart(
            [FromBody] PurchaseRequest req,
            CancellationToken ct) {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            try {
                var result = await _svc.PurchaseDocumentsAsync(req, userId, ct);
                return Ok(result);
            } catch (KeyNotFoundException ex) {
                return NotFound(new { message = ex.Message }); // 404
            } catch (InvalidOperationException ex) {
                //insufficient funds, already owned, buying own.
                return BadRequest(new { message = ex.Message }); // 400
            } catch (Exception ex) {
                // General server error
                return StatusCode(500, new { message = "An unexpected error occurred during the purchase.", details = ex.Message });
            }
        }

        [HttpPatch("{id:int}/edit")]
        [Authorize]
        public async Task<ActionResult<DocumentResponse>> Update([FromRoute] int id, [FromBody] UpdateDocumentDto dto, CancellationToken ct) {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) {
                return Unauthorized("User ID not found in token.");
            }

            string? userIdToPass = User.IsInRole("Admin") ? null : userId;

            try {

                var result = await _svc.UpdateAsync(id, userIdToPass, dto, ct);

                return Ok(result);
            } catch (KeyNotFoundException ex) {
                return NotFound(new { message = ex.Message });
            } catch (UnauthorizedAccessException ex) {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpPatch("{id:int}/active")]
        [Authorize]
        public async Task<ActionResult<DocumentResponse>> SetActiveStatus(
            [FromRoute] int id,
            [FromQuery] bool isActive,
            CancellationToken ct) {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) {
                return Unauthorized("User ID not found in token.");
            }

            string? userIdToPass = User.IsInRole("Admin") ? null : userId;

            try {
                var result = await _svc.ActiveSwitchAsync(id, userIdToPass, isActive, ct);
                return Ok(result);
            } catch (KeyNotFoundException ex) {
                return NotFound(new { message = ex.Message });
            } catch (UnauthorizedAccessException ex) {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpDelete("{id:int}/delete")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<DocumentResponse>> DeleteDocument(
            [FromRoute] int id,
            [FromQuery] bool isDeleted,
            CancellationToken ct) {
            try {
                var result = await _svc.DeleteAsync(id, isDeleted, ct);
                return Ok(result);
            } catch (KeyNotFoundException ex) {
                return NotFound(new { message = ex.Message });
            } catch (UnauthorizedAccessException ex) {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        //return string list of document images URL only
        [HttpGet("{id:int}/images")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDocumentImages([FromRoute] int id, CancellationToken ct) {
            var ImageUrlList = await _db.DocumentImages
                .AsNoTracking()
                .Where(img => img.DocumentId == id)
                .OrderBy(img => img.SortOrder)
                .Select(img => img.Url)
                .ToListAsync(ct);
            return Ok(ImageUrlList);
        }

        //return full list of document file entities
        [HttpGet("{id:int}/files")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDocumentFiles([FromRoute] int id, CancellationToken ct) {
            var FileList = await _db.DocumentFiles
                .AsNoTracking()
                .Where(f => f.DocumentId == id)
                .Select(f => new DocumentFileDto {
                    Id = f.Id,
                    FileName = f.FileName,
                    SizeBytes = f.SizeBytes
                })
                .ToListAsync(ct);
            return Ok(FileList);
        }
    }
}
