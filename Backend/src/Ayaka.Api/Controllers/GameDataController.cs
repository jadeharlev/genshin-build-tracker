using Ayaka.Api.Services.Cache;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameDataController : ControllerBase {
    private readonly IGameDataCache cache;
    public GameDataController(IGameDataCache cache) => this.cache = cache;

    [HttpGet("characters")]
    public async Task<IActionResult> GetAllCharacters() {
        var characters = await cache.GetAllCharactersAsync();
        return Ok(characters);
    }

    [HttpGet("characters/{key}")]
    public async Task<IActionResult> GetCharacter(string key) {
        var character = await cache.GetCharacterAsync(key);
        if (character == null) {
            return NotFound();
        }

        return Ok(character);
    }

    [HttpGet("weapons")]
    public async Task<IActionResult> GetAllWeapons() {
        var weapons = await cache.GetAllWeaponsAsync();
        return Ok(weapons);
    }

    [HttpGet("weapons/{key}")]
    public async Task<IActionResult> GetWeapon(string key) {
        var weapon = await cache.GetWeaponAsync(key);
        if (weapon == null) {
            return NotFound();
        }

        return Ok(weapon);
    }

    [HttpGet("artifacts")]
    public async Task<IActionResult> GetAllArtifactSets() {
        var sets = await cache.GetAllArtifactSetsAsync();
        return Ok(sets);
    }

    [HttpGet("validation-rules")]
    public async Task<IActionResult> GetValidationRules() {
        var rules = await cache.GetValidationRulesAsync();
        if (rules == null) {
            return NotFound();
        }

        return Ok(rules);
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetInitializationStatus() {
        var isInitialized = await cache.IsInitializedAsync();
        return Ok(isInitialized);
    }
}