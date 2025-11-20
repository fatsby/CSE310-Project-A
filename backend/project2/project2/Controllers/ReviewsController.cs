using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project2.DTOs.ReviewDto;
using project2.Services;
using System.Security.Claims;

namespace project2.Controllers {
    [Route("api/reviews")]
    [ApiController]
    public class ReviewsController : ControllerBase {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService) {
            _reviewService = reviewService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetReview([FromQuery] int? documentId, [FromQuery] string? userId, CancellationToken ct) {
            try {
                var review = await _reviewService.GetReviewAsync(userId ?? "", documentId ?? null);
                return Ok(review);
            } catch (KeyNotFoundException ex) {
                return NotFound(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto, CancellationToken ct) {
            try {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User ID not found in token.");

                var review = await _reviewService.CreateAsync(userId, dto, ct);
                return Ok(review);
            } catch (KeyNotFoundException ex) {
                return NotFound(ex.Message);
            } catch (InvalidOperationException ex) {
                return BadRequest(ex.Message);
            } catch (UnauthorizedAccessException ex) {
                return Forbid(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpPatch("update")]
        [Authorize]
        public async Task<IActionResult> UpdateReview([FromQuery] int documentId, [FromBody] UpdateReviewDto dto, CancellationToken ct) {
            try {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User ID not found in token.");
                var review = await _reviewService.UpdateAsync(userId, documentId, dto, ct);
                return Ok(review);
            } catch (KeyNotFoundException ex) {
                return NotFound(ex.Message);
            } catch (InvalidOperationException ex) {
                return BadRequest(ex.Message);
            } catch (UnauthorizedAccessException ex) {
                return Forbid(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpDelete("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteReview([FromQuery] int documentId, CancellationToken ct) {
            try {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User ID not found in token.");
                await _reviewService.DeleteAsync(userId, documentId, ct);
                return NoContent();
            } catch (KeyNotFoundException ex) {
                return NotFound(ex.Message);
            } catch (UnauthorizedAccessException ex) {
                return Forbid(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("averageRating")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAverageRatings(CancellationToken ct) {
            try {
                var averages = await _reviewService.GetAverageRatingsAsync(ct);
                return Ok(averages);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }
}
