using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

// not authorize-locked since it's view-only and not privileged data
[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase {
    private readonly IStatsRepository statsRepository;

    public StatsController(IStatsRepository statsRepository) {
        this.statsRepository = statsRepository;
    }

    [HttpGet("levelstats")]
    public async Task<IActionResult> GetLevelStats() {
        var levelStats = await statsRepository.GetLevelStatsAsync();
        return Ok(levelStats);
    }

    [HttpGet("raritystats")]
    public async Task<IActionResult> GetRarityStats() {
        var rarityStats = await statsRepository.GetRarityStatsAsync();
        return Ok(rarityStats);
    }
}