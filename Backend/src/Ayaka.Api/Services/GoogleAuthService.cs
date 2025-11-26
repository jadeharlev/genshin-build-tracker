using Ayaka.Api.Services;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Protocols.Configuration;

public class GoogleAuthService : IGoogleAuthService {
    private readonly IConfiguration configuration;
    private readonly ILogger<GoogleAuthService> logger;

    public GoogleAuthService(IConfiguration configuration, ILogger<GoogleAuthService> logger) {
        this.configuration = configuration;
        this.logger = logger;
    }
    
    public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken) {
        try {
            var clientId = configuration["Google:ClientId"] ??
                           throw new InvalidOperationException("Google ClientId not configured");
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }
        catch (InvalidJwtException e) {
            logger.LogWarning(e, "Invalid Google JWT token");
            return null;
        }
        catch (Exception e) {
            logger.LogError(e, "Error verifying Google JWT token");
            return null;
        }
    }
}