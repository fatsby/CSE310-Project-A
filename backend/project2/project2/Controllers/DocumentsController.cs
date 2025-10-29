﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs;
using project2.Services;
using System.Security.Claims;

namespace project2.Controllers {
    [Route("api/documents")]
    [ApiController]
    public class DocumentsController : ControllerBase {
        private readonly IDocumentService _svc;

        public DocumentsController(IDocumentService svc) => _svc = svc;

        [HttpPost]
        [Authorize] // require login
        [RequestSizeLimit(150_000_000)] // 150MB per request
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<DocumentResponse>> Create([FromForm] CreateDocumentRequest req, CancellationToken ct) {
            // get current user id from claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var result = await _svc.CreateAsync(userId, req, ct);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // Basic fetch
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<DocumentResponse>> Get([FromRoute] int id, [FromServices] AppDbContext db) {
            var doc = await db.Documents
            .Include(d => d.University)
            .Include(d => d.Subject)
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
                Files = doc.Files.Select(f => new DocumentFileDto {
                    Id = f.Id,
                    FileName = f.FileName,
                    SizeBytes = f.SizeBytes
                })
            };

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
                return Forbid(ex.Message); // 403 Forbidden
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
    }
}
