using System.Text.Json;
using Ayaka.Api.Services;
using StackExchange.Redis;

public class RefreshTokenService : IRefreshTokenService {
    private readonly IConnectionMultiplexer redis;
    private readonly ILogger<RefreshTokenService> logger;
    private const string RefreshTokenPrefix = "refresh_token:";
    private const string UserTokensPrefix = "user_tokens:";

    public RefreshTokenService(IConnectionMultiplexer redis, ILogger<RefreshTokenService> logger) {
        this.redis = redis;
        this.logger = logger;
    }
    public async Task StoreRefreshTokenAsync(string token, int userId, string googleId, int expirationInDays) {
        var database = redis.GetDatabase();
        var tokenData = new RefreshTokenData
        {
            UserID = userId,
            GoogleID = googleId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(expirationInDays)
        };
        
        var json = JsonSerializer.Serialize(tokenData);
        var expiry = TimeSpan.FromDays(expirationInDays);
        
        await database.StringSetAsync(RefreshTokenPrefix + token, json, expiry);

        await database.SetAddAsync(UserTokensPrefix + userId, token);
        await database.KeyExpireAsync(UserTokensPrefix + userId ,expiry);
    }

    public async Task<RefreshTokenData?> GetRefreshTokenDataAsync(string refreshToken) {
        var database = redis.GetDatabase();
        var json = await database.StringGetAsync(RefreshTokenPrefix + refreshToken);
        if (json.IsNullOrEmpty) {
            return null;
        }

        try {
            var tokenData = JsonSerializer.Deserialize<RefreshTokenData>(json);
            if (tokenData?.ExpiresAt < DateTime.UtcNow) {
                await RevokeRefreshTokenAsync(refreshToken);
                return null;
            }

            return tokenData;
        }
        catch (Exception e) {
            logger.LogError(e, "Error deserializing refresh token data");
            return null;
        }
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken) {
        var database = redis.GetDatabase();
        
        var json = await database.StringGetAsync(RefreshTokenPrefix + refreshToken);
        if (!json.IsNullOrEmpty) {
            try {
                var tokenData = JsonSerializer.Deserialize<RefreshTokenData>(json!);
                if (tokenData != null) {
                    await database.SetRemoveAsync(UserTokensPrefix + tokenData.UserID, refreshToken);
                }
            }
            catch (Exception e) {
                logger.LogError(e, "Error revoking refresh token");
            }
        }
        await database.KeyDeleteAsync(RefreshTokenPrefix+refreshToken);
    }

    public async Task RevokeAllUserRefreshTokensAsync(int userId) {
        var database = redis.GetDatabase();
        var tokens = await database.SetMembersAsync(UserTokensPrefix + userId);
        foreach (var token in tokens) {
            await database.KeyDeleteAsync(RefreshTokenPrefix + token);
        }
        
        await database.KeyDeleteAsync(UserTokensPrefix + userId);
    }
}