using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Ayaka.Api.Services;
using Microsoft.IdentityModel.Protocols.Configuration;
using Microsoft.IdentityModel.Tokens;

public class JwtService : IJwtService {
    private readonly IConfiguration configuration;
    private readonly JwtSecurityTokenHandler jwtSecurityTokenHandler;
    
    public JwtService(IConfiguration configuration) {
        this.configuration = configuration;
        jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
    }
    
    public string GenerateAccessToken(int userId, string email, string displayName) {
        var secret = configuration["Jwt:Secret"] ?? throw new InvalidConfigurationException("JWT Secret not found.");
        var issuer =  configuration["Jwt:Issuer"] ?? "Ayaka.Api";
        var audience = configuration["Jwt:Audience"] ?? "Ayaka.Frontend";
        var expirationMinutes = int.Parse(configuration["Jwt:ExpirationMinutes"] ?? "60");
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Name, displayName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", userId.ToString()),
        };
        
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.Now.AddMinutes(expirationMinutes),
            signingCredentials: credentials);
        
        return jwtSecurityTokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken() {
        var randomBytes = new byte[64];
        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public ClaimsPrincipal? ValidateToken(string token) {
        var secret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
        var issuer = configuration["Jwt:Issuer"] ?? "Ayaka.Api";
        var audience = configuration["Jwt:Audience"] ?? "Ayaka.Frontend";

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ClockSkew = TimeSpan.Zero
        };

        try {
            var principal = jwtSecurityTokenHandler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch {
            return null;
        }
    }
}