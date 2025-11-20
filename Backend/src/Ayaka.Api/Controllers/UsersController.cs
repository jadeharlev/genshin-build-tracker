using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
    private readonly IUserRepository userRepository;

    public UsersController(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    [HttpGet("{userID}")]
    public async Task<IActionResult> GetByID(int userID) {
        var users = await userRepository.GetByIDAsync(userID);
        if (users == null) {
            return NotFound();
        }

        return Ok(users);
    }
    
    [HttpPut("{userID}")]
    public async Task<IActionResult> Update(int userID, [FromBody] User user) {
        if (userID != user.UserID) {
            return BadRequest();
        }

        var success = await userRepository.UpdateAsync(user);
        return success ? NoContent() : NotFound();
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User user) {
        var newID = await userRepository.CreateAsync(user);
        user.UserID = newID;
        return CreatedAtAction(nameof(GetByID), new { userID = newID }, user);
    }
    
    [HttpDelete("{userID}")]
    public async Task<IActionResult> Delete(int userID) {
        var success = await userRepository.DeleteAsync(userID);
        return success ? NoContent() : NotFound();
    }
}