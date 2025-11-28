using Ayaka.Api.Services.GameData;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase {
    private readonly IGameDataService gameDataService;
    private readonly ILogger<AdminController> logger;

    public AdminController(IGameDataService gameDataService, ILogger<AdminController> logger) {
        this.gameDataService = gameDataService;
        this.logger = logger;
    }

    [HttpPost("refresh-game-data")]
    public async Task<IActionResult> RefreshGameData() {
        try {
            logger.LogInformation("Admin triggered game data refresh.");
            await gameDataService.RefreshDataAsync();

            return Ok(new
            {
                message = "Game data refreshed successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception e) {
            logger.LogError(e, "Error during game data refresh.");
            return StatusCode(500, new
            {
                error = "Failed to refresh game data",
                message = e.Message
            });
        }
    }

    [HttpGet("game-data-status")]
    public async Task<IActionResult> GetGameDataStatus() {
        try {
            var isInitialized = await gameDataService.IsInitializedAsync();

            return Ok(new
            {
                initialized = isInitialized,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception e) {
            logger.LogError(e, "Error checking game data status.");
            return StatusCode(500, new
                {
                    error = "Failed to check game data status",
                    message = e.Message
                }
            );
        }
    }

}