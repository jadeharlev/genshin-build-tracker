using System.Text;
using Ayaka.Api.Configuration;
using Ayaka.Api.Data.Models.GameData;
using Ayaka.Api.Repositories;
using Ayaka.Api.Services;
using Ayaka.Api.Services.Cache;
using Ayaka.Api.Services.GameData;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.Configuration;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

#region Services
builder.Services.AddScoped<IArtifactRepository, ArtifactRepository>();
builder.Services.AddScoped<ICharacterRepository, CharacterRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWeaponRepository, WeaponRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IBuildRepository, BuildRepository>();

builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.AddHttpClient<IGameDataParser, GameDataParser>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "Ayaka/1.0");
});
builder.Services.AddHttpClient<IImageDownloader, ImageDownloader>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "Ayaka/1.0");
});

var redisConnection = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnection));

builder.Services.AddSingleton<IGameDataCache, GameDataCache>();
builder.Services.AddSingleton<IGameDataService, GameDataService>();

builder.Services.Configure<GameDataOptions>(builder.Configuration.GetSection("GameData"));

builder.Services.AddDirectoryBrowser();


var jwtSecret = builder.Configuration["Jwt:Secret"] ??
                throw new InvalidConfigurationException("JWT secret not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Ayaka.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "Ayaka.Frontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", // vite default port
                "https://localhost:5173"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header w/ bearer scheme. Format: {'Bearer' Token}",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
#endregion

var app = builder.Build();

var imagesPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "images");
Directory.CreateDirectory(imagesPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesPath),
    RequestPath = "/images"
});

using (var scope = app.Services.CreateScope()) {
    var gameDataService = scope.ServiceProvider.GetRequiredService<IGameDataService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try {
        logger.LogInformation("Checking game data initialization.");
        if (!await gameDataService.IsInitializedAsync()) {
            logger.LogInformation("Game data not initialized. Initializing...");
            await gameDataService.InitializeAsync();
        }
        else {
            logger.LogInformation("Game data already initialized.");
            var options = app.Services.GetRequiredService<IOptions<GameDataOptions>>().Value;
            if (options.RefreshDataOnStartup) {
                logger.LogInformation("RefreshDataOnStartup enabled. Refreshing...");
                await gameDataService.RefreshDataAsync();
            }
        }
    }
    catch (Exception e) {
        logger.LogError(e, "An error occurred during game data initialization. Continuing.");
    }
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();