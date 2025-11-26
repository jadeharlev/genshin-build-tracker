using Google.Apis.Auth;

namespace Ayaka.Api.Services;

public interface IGoogleAuthService {
    Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken);
}