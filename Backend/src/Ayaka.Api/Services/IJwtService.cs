using System.Security.Claims;

namespace Ayaka.Api.Services;

public interface IJwtService {
    string GenerateAccessToken(int userId, string email, string displayName);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
}