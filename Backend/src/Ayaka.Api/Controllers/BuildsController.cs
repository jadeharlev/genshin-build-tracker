using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BuildsController : ControllerBase {
    private readonly IBuildRepository buildRepository;
    private readonly ILogger<BuildsController> logger;

    public BuildsController(IBuildRepository buildRepository, ILogger<BuildsController> logger) {
        this.buildRepository = buildRepository;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var builds = await buildRepository.GetAllByUserAsync(userId.Value);
        return Ok(builds);
    }

    [HttpGet("{buildId}")]
    public async Task<IActionResult> GetById(int buildId) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var build = await buildRepository.GetByIdAsync(buildId);
        if (build == null) return NotFound();
        
        if(build.UserID != userId.Value) return Forbid();
        
        return Ok(build);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBuildRequest request) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var build = new Build
        {
            BuildName = request.BuildName,
            CharacterID = request.CharacterID,
            WeaponID = request.WeaponID,
            FlowerID = request.FlowerID,
            FeatherID = request.FeatherID,
            SandsID = request.SandsID,
            GobletID = request.GobletID,
            CircletID = request.CircletID,
            UserID = userId.Value
        };

        try {
            var newId = await buildRepository.CreateAsync(build);
            var createdBuild = await buildRepository.GetByIdAsync(newId);
            return CreatedAtAction(nameof(GetById), new { buildId = newId }, createdBuild);
        }
        catch (Exception e) {
            logger.LogError(e, "Error creating build");
            return StatusCode(500, "Failed to create build: " + e.Message);
        }
    }

    [HttpPut("{buildId}")]
    public async Task<IActionResult> Update(int buildId, [FromBody] UpdateBuildRequest request) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var existingBuild = await buildRepository.GetByIdAsync(buildId);
        if (existingBuild == null) return NotFound();
        if (existingBuild.UserID != userId.Value) return Forbid();

        var build = new Build
        {
            BuildID = buildId,
            BuildName = request.BuildName,
            CharacterID = request.CharacterID,
            WeaponID = request.WeaponID,
            FlowerID = request.FlowerID,
            FeatherID = request.FeatherID,
            SandsID = request.SandsID,
            GobletID = request.GobletID,
            CircletID = request.CircletID,
            UserID = userId.Value
        };

        try {
            var success = await buildRepository.UpdateAsync(build);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating build");
            return StatusCode(500, "Failed to update build: " + e.Message);
        }
    }

    [HttpDelete("{buildId}")]
    public async Task<IActionResult> Delete(int buildId) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        try {
            var success = await buildRepository.DeleteAsync(buildId, userId.Value);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting build " + buildId);
            return StatusCode(500, "Failed to delete build: " + e.Message);
        }
    }
}
