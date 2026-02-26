using System.Security.Claims;

namespace Ayaka.Api.Extensions;

public static class ClaimsPrincipalExtensions {
    public static int? GetUserId(this ClaimsPrincipal principal) {
        var userIdClaim = principal.FindFirst("userId")?.Value;
        if (userIdClaim != null && int.TryParse(userIdClaim, out var userId)) {
            return userId;
        }
        return null;
    }
}