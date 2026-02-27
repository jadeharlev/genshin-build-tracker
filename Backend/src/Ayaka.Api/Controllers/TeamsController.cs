using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
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
    
    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var userID = User.GetUserId();
        if (userID == null) return Unauthorized();
        var teams = await teamRepository.GetAllByUserAsync(userID.Value);
        return Ok(teams);
    }

    [HttpGet("{teamId}")]
    public async Task<IActionResult> GetById(int teamId) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();
        var team = await teamRepository.GetByIdAsync(teamId);
        if (team == null) return NotFound();
        if (team.UserID != currentUserId) return Forbid();
        return Ok(team);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamRequest request) {
        var userId = User.GetUserId();
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
            return StatusCode(500, "Error creating team");
        }
    }

    [HttpPut("{teamId}")]
    public async Task<IActionResult> Update(int teamId, [FromBody] UpdateTeamRequest request) {
        var userId = User.GetUserId();
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
            return StatusCode(500, "Error updating team");
        }
    }

    [HttpDelete("{teamId}")]
    public async Task<IActionResult> Delete(int teamId) {
        var currentTeam = await teamRepository.GetByIdAsync(teamId);
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();

        if (currentTeam == null) return NotFound();
        if (currentTeam.UserID != currentUserId) return Forbid();
        
        try {
            var success = await teamRepository.DeleteAsync(teamId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting team");
            return StatusCode(500, "Error deleting team");
        }
    }
}