using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
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

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();

        var weapons = await weaponRepository.GetAllByUserAsync(currentUserId.Value);
        return Ok(weapons);
    }

    [HttpGet("{weaponID}")]
    public async Task<IActionResult> GetByID(int weaponID) {
        var weapon = await weaponRepository.GetByIdAsync(weaponID);
        if (weapon == null) return NotFound();
        var currentUserId = User.GetUserId();
        
        if (currentUserId == null || weapon.UserID != currentUserId) {
            return Forbid();
        }
        
        return Ok(weapon);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Weapon weapon) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();
        weapon.UserID = currentUserId.Value;
        try {
            var newId = await weaponRepository.CreateAsync(weapon);
            var createdWeapon = await weaponRepository.GetByIdAsync(newId);
            return CreatedAtAction(nameof(GetByID), new { weaponID = newId }, createdWeapon);
        }
        catch (Exception e) {
            logger.LogError(e, "Error creating weapon");
            return StatusCode(500, "Error creating weapon");
        }
    }

    [HttpPut("{weaponID}")]
    public async Task<IActionResult> Update(int weaponID, [FromBody] Weapon weapon) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();

        if (weaponID != weapon.WeaponID) return BadRequest();

        var existingWeapon = await weaponRepository.GetByIdAsync(weaponID);
        if (existingWeapon == null)  return NotFound();
        if (existingWeapon.UserID != currentUserId) return Forbid();
        
        weapon.UserID = currentUserId.Value;
        
        try {
            var success = await weaponRepository.UpdateAsync(weapon);
            if (!success) return BadRequest();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating weapon");
            return StatusCode(500, "Failed to update weapon.");
        }
    }

    [HttpDelete("{weaponID}")]
    public async Task<IActionResult> Delete(int weaponID) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null) return Unauthorized();

        var existingWeapon = await weaponRepository.GetByIdAsync(weaponID);
        if (existingWeapon == null)  return NotFound();
        if (existingWeapon.UserID != currentUserId) return Forbid();
        
        try {
            var success = await weaponRepository.DeleteAsync(weaponID);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting weapon " + weaponID);
            return StatusCode(500, "Failed to delete weapon.");
        }
    }

}