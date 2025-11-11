using project2.DTOs;

namespace project2.Services {
    public interface ICouponService {
        Task<CouponDto> CreateAsync(CreateCouponDto dto);
        Task<CouponDto?> GetByCodeAsync(string code);
        Task<IEnumerable<CouponDto>> GetAllAsync();
        Task<CouponDto?> UpdateAsync(string code, UpdateCouponDto dto);
        Task<bool> DeleteAsync(string code);
    }
}
