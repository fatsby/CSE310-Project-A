using project2.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace project2.Infrastructure {
    public class UserStatusMiddleware {
        private readonly RequestDelegate _next;

        public UserStatusMiddleware(RequestDelegate next) {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, UserManager<AppUser> userManager) {
            // check if the user is Authenticated (has a valid token)
            if (context.User.Identity?.IsAuthenticated == true) {
                // get the User ID from the claims
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!string.IsNullOrEmpty(userId)) {
                    //change this to cache for better performance
                    // check the database for current status
                    var user = await userManager.FindByIdAsync(userId);

                    // if user is missing or banned, reject the request
                    if (user == null || !user.IsActive) {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsJsonAsync(new { detail = "Your account has been banned." });
                        return; // stop the pipeline here
                    }
                }
            }

            // if all is good, continue
            await _next(context);
        }
    }
}