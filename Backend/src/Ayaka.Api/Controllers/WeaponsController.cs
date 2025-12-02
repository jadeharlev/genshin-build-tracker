using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WeaponsController : ControllerBase {
    private readonly IWeaponRepository weaponRepository;
    private readonly ILogger<WeaponsController> logger;

    public WeaponsController(IWeaponRepository weaponRepository, ILogger<WeaponsController> logger) {
        this.weaponRepository = weaponRepository;
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
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var weapons = await weaponRepository.GetAllByUserAsync(userId.Value);
        return Ok(weapons);
    }

    [HttpGet("{weaponID}")]
    public async Task<IActionResult> GetByID(int weaponID) {
        var weapon = await weaponRepository.GetByIdAsync(weaponID);
        if (weapon == null) return NotFound();
        return Ok(weapon);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Weapon weapon) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        weapon.UserID = userId.Value;
        try {
            var newId = await weaponRepository.CreateAsync(weapon);
            var createdWeapon = await weaponRepository.GetByIdAsync(newId);
            return CreatedAtAction(nameof(GetByID), new { weaponID = newId }, createdWeapon);
        }
        catch (Exception e) {
            logger.LogError(e, "Error creating weapon");
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut("{weaponID}")]
    public async Task<IActionResult> Update(int weaponID, [FromBody] Weapon weapon) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if (weaponID != weapon.WeaponID) return BadRequest();
        
        try {
            var success = await weaponRepository.UpdateAsync(weapon);
            if (!success) return BadRequest();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating weapon");
            return StatusCode(500, "Failed to update weapon: " + e.Message);
        }
    }

    [HttpDelete("{weaponID}")]
    public async Task<IActionResult> Delete(int weaponID) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        try {
            var success = await weaponRepository.DeleteAsync(weaponID);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting weapon " + weaponID);
            return StatusCode(500, "Failed to delete weapon: " + e.Message);
        }
    }

}