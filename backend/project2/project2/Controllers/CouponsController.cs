using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project2.DTOs;
using project2.Services;

namespace project2.Controllers {
    [Route("api/coupons")]
    [ApiController]
    [Authorize]
    public class CouponsController : ControllerBase {
        private readonly ICouponService _couponService;

        public CouponsController(ICouponService couponService) {
            _couponService = couponService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CouponDto>> Create(CreateCouponDto dto) {
            try {
                var coupon = await _couponService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetByCode), new { code = coupon.Code }, coupon);
            } catch (InvalidOperationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CouponDto>>> GetAll() {
            var coupons = await _couponService.GetAllAsync();
            return Ok(coupons);
        }

        [HttpGet("{code}")]
        public async Task<ActionResult<CouponDto>> GetByCode(string code) {
            var coupon = await _couponService.GetByCodeAsync(code);
            return coupon == null ? NotFound() : Ok(coupon);
        }

        [HttpPut("{code}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CouponDto>> Update(string code, UpdateCouponDto dto) {
            var coupon = await _couponService.UpdateAsync(code, dto);
            return coupon == null ? NotFound() : Ok(coupon);
        }

        [HttpDelete("{code}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string code) {
            var success = await _couponService.DeleteAsync(code);
            return success ? NoContent() : NotFound();
        }
    }
}