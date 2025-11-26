namespace Ayaka.Api.Services;

public interface IRefreshTokenService {
    Task StoreRefreshTokenAsync(string token, int userId, string googleId, int expirationInDays);
    Task<RefreshTokenData?> GetRefreshTokenDataAsync(string refreshToken);
    Task RevokeRefreshTokenAsync(string refreshToken);
    Task RevokeAllUserRefreshTokensAsync(int userId);
}