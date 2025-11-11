using Microsoft.EntityFrameworkCore;
using project2.Data;
using project2.DTOs;
using project2.Models;

namespace project2.Services {
    public class CouponService : ICouponService {
        private readonly AppDbContext _db;

        public CouponService(AppDbContext db) {
            _db = db;
        }

        public async Task<CouponDto> CreateAsync(CreateCouponDto dto) {
            var code = dto.Code.ToUpperInvariant();
            if (await _db.Coupons.AnyAsync(c => c.Code == code)) {
                throw new InvalidOperationException("Coupon code already exists.");
            }

            var coupon = new Coupon {
                Code = code,
                DiscountPercentage = dto.DiscountPercentage,
                ExpiryDate = dto.ExpiryDate.Value,
                IsActive = true
            };

            _db.Coupons.Add(coupon);
            await _db.SaveChangesAsync();
            return ToDto(coupon);
        }

        public async Task<CouponDto?> GetByCodeAsync(string code) {
            var coupon = await _db.Coupons
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Code == code.ToUpperInvariant());

            return coupon == null ? null : ToDto(coupon);
        }

        public async Task<IEnumerable<CouponDto>> GetAllAsync() {
            return await _db.Coupons
                .AsNoTracking()
                .Select(c => ToDto(c))
                .ToListAsync();
        }

        public async Task<CouponDto?> UpdateAsync(string code, UpdateCouponDto dto) {
            var coupon = await _db.Coupons
                .FirstOrDefaultAsync(c => c.Code == code.ToUpperInvariant());

            if (coupon == null) return null;

            // Apply partial updates
            if (dto.DiscountPercentage.HasValue)
                coupon.DiscountPercentage = dto.DiscountPercentage.Value;
            if (dto.ExpiryDate.HasValue)
                coupon.ExpiryDate = dto.ExpiryDate.Value;
            if (dto.IsActive.HasValue)
                coupon.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return ToDto(coupon);
        }

        public async Task<bool> DeleteAsync(string code) {
            var coupon = await _db.Coupons
                .FirstOrDefaultAsync(c => c.Code == code.ToUpperInvariant());

            if (coupon == null) return false;

            _db.Coupons.Remove(coupon);
            await _db.SaveChangesAsync();
            return true;
        }

        // Helper to map entity to DTO
        private static CouponDto ToDto(Coupon c) => new() {
            Code = c.Code,
            DiscountPercentage = c.DiscountPercentage,
            ExpiryDate = c.ExpiryDate,
            IsActive = c.IsActive
        };
    }
}