using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CharactersController : ControllerBase {
    private readonly ICharacterRepository characterRepository;
    public CharactersController(ICharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var characters = await characterRepository.GetAllByUserAsync(userId.Value);
        return Ok(characters);
    }
    
    [HttpGet("{characterID}")]
    public async Task<IActionResult> GetByID(int characterID) {
        var character = await characterRepository.GetByIDAsync(characterID);
        var userId = User.GetUserId();
        if(userId == null) return Unauthorized();
        
        if(character == null) return NotFound();
        if(character.UserID != userId) return Unauthorized();
        return Ok(character);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Character character) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        character.UserID = userId.Value;
        
        var newID = await characterRepository.CreateAsync(character);
        character.CharacterID = newID;
        return CreatedAtAction(nameof(GetByID), new { characterID = newID }, character);
    }

    [HttpPut("{characterID}")]
    public async Task<IActionResult> Update(int characterID, [FromBody] Character character) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        if (characterID != character.CharacterID) {
            return BadRequest();
        }
        
        var existingCharacter = await characterRepository.GetByIDAsync(characterID);
        if (existingCharacter == null) return NotFound();
        if (existingCharacter.UserID != userId.Value) {
            return Forbid();
        }
        
        character.UserID = userId.Value;

        var success = await characterRepository.UpdateAsync(character);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{characterID}")]
    public async Task<IActionResult> Delete(int characterID) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var existingCharacter = await characterRepository.GetByIDAsync(characterID);
        if (existingCharacter == null) return NotFound();
        if (existingCharacter.UserID != userId.Value) return Forbid();
        
        var success = await characterRepository.DeleteAsync(characterID);
        return success ? NoContent() : NotFound();
    }
}