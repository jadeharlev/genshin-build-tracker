using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TeamsController : ControllerBase {
    private readonly ITeamRepository teamRepository;
    private readonly ILogger<TeamsController> logger;
    
    public TeamsController(ITeamRepository teamRepository, ILogger<TeamsController> logger) {
        this.teamRepository = teamRepository;
        this.logger = logger;
    }
    
    private int? GetCurrentUserId() {
        // user ID is stored in the JWT claim
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim != null && int.TryParse(userIdClaim, out var userId)) {
            return userId;
        }

        return null;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var userID = GetCurrentUserId();
        if (userID == null) return Unauthorized();
        var teams = await teamRepository.GetAllByUserAsync(userID.Value);
        return Ok(teams);
    }

    [HttpGet("{teamId}")]
    public async Task<IActionResult> GetById(int teamId) {
        var team = await teamRepository.GetByIdAsync(teamId);
        if (team == null) return NotFound();
        return Ok(team);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamRequest request) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var team = new Team
        {
            TeamName = request.TeamName,
            FirstCharacterID = request.FirstCharacterID,
            SecondCharacterID = request.SecondCharacterID,
            ThirdCharacterID = request.ThirdCharacterID,
            FourthCharacterID = request.FourthCharacterID,
            UserID = userId.Value
        };

        try {
            var newId = await teamRepository.CreateAsync(team);
            var createdTeam = await teamRepository.GetByIdAsync(newId);
            return CreatedAtAction(nameof(GetById), new { teamId = newId }, createdTeam);
        }
        catch (Exception e) {
            logger.LogError(e, "Error creating team");
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut("{teamId}")]
    public async Task<IActionResult> Update(int teamId, [FromBody] UpdateTeamRequest request) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var team = new Team
        {
            TeamID = teamId,
            TeamName = request.TeamName,
            FirstCharacterID = request.FirstCharacterID,
            SecondCharacterID = request.SecondCharacterID,
            ThirdCharacterID = request.ThirdCharacterID,
            FourthCharacterID = request.FourthCharacterID,
            UserID = userId.Value
        };

        try {
            var success = await teamRepository.UpdateAsync(team);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating team");
            return StatusCode(500, e.Message);
        }
    }

    [HttpDelete("{teamId}")]
    public async Task<IActionResult> Delete(int teamId) {
        try {
            var success = await teamRepository.DeleteAsync(teamId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting team");
            return StatusCode(500, e.Message);
        }
    }
}