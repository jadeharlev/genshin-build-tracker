using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase {
    private readonly ICharacterRepository characterRepository;
    public CharactersController(ICharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var characters = await characterRepository.GetAllAsync();
        return Ok(characters);
    }
    
    [HttpGet("{characterID}")]
    public async Task<IActionResult> GetByID(int characterID) {
        var characters = await characterRepository.GetByIDAsync(characterID);
        if (characters == null)
            return NotFound();
        return Ok(characters);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Character character) {
        var newID = await characterRepository.CreateAsync(character);
        character.CharacterID = newID;
        return CreatedAtAction(nameof(GetByID), new { characterID = newID }, character);
    }

    [HttpPut("{characterID}")]
    public async Task<IActionResult> Update(int characterID, [FromBody] Character character) {
        if (characterID != character.CharacterID) {
            return BadRequest();
        }

        var success = await characterRepository.UpdateAsync(character);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{characterID}")]
    public async Task<IActionResult> Delete(int characterID) {
        var success = await characterRepository.DeleteAsync(characterID);
        return success ? NoContent() : NotFound();
    }
}