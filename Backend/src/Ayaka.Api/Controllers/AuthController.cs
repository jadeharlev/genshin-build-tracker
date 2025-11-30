using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Ayaka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZstdSharp.Unsafe;

namespace Ayaka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly IGoogleAuthService googleAuthService;
    private readonly IJwtService jwtService;
    private readonly IRefreshTokenService refreshTokenService;
    private readonly IUserRepository userRepository;
    private readonly IConfiguration configuration;
    private readonly ILogger<AuthController> logger;

    public AuthController(
        IGoogleAuthService googleAuthService,
        IJwtService jwtService,
        IRefreshTokenService refreshTokenService,
        IUserRepository userRepository,
        IConfiguration configuration,
        ILogger<AuthController> logger) {
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.configuration = configuration;
        this.logger = logger;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request) {
        var payload = await googleAuthService.VerifyGoogleTokenAsync(request.IdToken);
        if (payload == null) {
            return Unauthorized(new { message = "Invalid Google token." });
        }

        var existingUser = await userRepository.GetByGoogleIDAsync(payload.Subject);
        User user;
        bool isNewUser = false;

        if (existingUser == null) {
            if (!request.AdventureRank.HasValue || string.IsNullOrWhiteSpace(request.AccountName)) {
                return BadRequest(new
                {
                    message = "Adventure Rank and Account Name are required for new users.",
                    isNewUser = true
                });
            }

            user = new User
            {
                GoogleID = payload.Subject,
                Email = payload.Email,
                DisplayName = payload.Name,
                AdventureRank = request.AdventureRank,
                AccountName = request.AccountName
            };

            var newUserId = await userRepository.CreateAsync(user);
            user.UserID = newUserId;
            isNewUser = true;

            logger.LogInformation($"New user created: {user.Email}, User Id: {newUserId}");
        }
        else {
            user = existingUser;
            if (request.AdventureRank.HasValue || !string.IsNullOrWhiteSpace(request.AccountName)) {
                if (request.AdventureRank.HasValue) {
                    user.AdventureRank = request.AdventureRank;
                }

                if (!string.IsNullOrWhiteSpace(request.AccountName)) {
                    user.AccountName = request.AccountName;
                }

                await userRepository.UpdateAsync(user);
            }

            logger.LogInformation($"User logged in: {user.Email}, User Id: {user.UserID}");
        }

        var accessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.DisplayName);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshExpirationInDays = int.Parse(configuration["Jwt:RefreshExpirationDays"] ?? "7");
        await refreshTokenService.StoreRefreshTokenAsync(
            refreshToken,
            user.UserID,
            payload.Subject,
            refreshExpirationInDays);

        var expirationInMinutes = int.Parse(configuration["Jwt:ExpirationMinutes"] ?? "60");
        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            User = new UserInfo
            {
                UserID = user.UserID,
                Email = user.Email,
                DisplayName = user.DisplayName,
                AdventureRank = user.AdventureRank,
                AccountName = user.AccountName,
                IsNewUser = isNewUser
            }
        };

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request) {
        var tokenData = await refreshTokenService.GetRefreshTokenDataAsync(request.RefreshToken);
        if (tokenData == null) {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }
        
        var user = await userRepository.GetByIDAsync(tokenData.UserID);
        if (user == null) {
            await refreshTokenService.RevokeRefreshTokenAsync(request.RefreshToken);
            return Unauthorized(new { message = "User not found." });
        }

        if (user.GoogleID != tokenData.GoogleID) {
            await refreshTokenService.RevokeRefreshTokenAsync(request.RefreshToken);
            return Unauthorized(new { message = "Token mismatch." });
        }

        var accessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.DisplayName);
        var newRefreshToken = jwtService.GenerateRefreshToken();

        await refreshTokenService.RevokeRefreshTokenAsync(request.RefreshToken);
        var refreshExpirationInDays = int.Parse(configuration["Jwt:RefreshExpirationDays"] ?? "7");
        await refreshTokenService.StoreRefreshTokenAsync(
            newRefreshToken,
            user.UserID,
            user.GoogleID,
            refreshExpirationInDays);

        var expirationInMinutes = int.Parse(configuration["Jwt:ExpirationMinutes"] ?? "60");
        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            User = new UserInfo
            {
                UserID = user.UserID,
                Email = user.Email,
                DisplayName = user.DisplayName,
                AdventureRank = user.AdventureRank,
                AccountName = user.AccountName,
                IsNewUser = false
            }
        };
        
        return Ok(response);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout() {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId)) {
            return BadRequest(new { message = "Invalid token." });
        }

        await refreshTokenService.RevokeAllUserRefreshTokensAsync(userId);
        
        logger.LogInformation("User logged out with User ID " + userId);
        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser() {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId)) {
            return Unauthorized();
        }

        var user = await userRepository.GetByIDAsync(userId);
        if (user == null) {
            return NotFound();
        }

        return Ok(new UserInfo
        {
            UserID = user.UserID,
            Email = user.Email,
            DisplayName = user.DisplayName,
            AdventureRank = user.AdventureRank,
            AccountName = user.AccountName,
            IsNewUser = false
        });
    }
}