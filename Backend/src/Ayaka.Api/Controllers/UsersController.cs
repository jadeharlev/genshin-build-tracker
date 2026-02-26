using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
    private readonly IUserRepository userRepository;

    public UsersController(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }
    

    [HttpGet("{userID}")]
    public async Task<IActionResult> GetByID(int userID) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null || userID != currentUserId) {
            return Forbid();
        }
        
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
        
        var currentUserId = User.GetUserId();
        if (currentUserId == null || userID != currentUserId) {
            return Forbid();
        }

        var success = await userRepository.UpdateAsync(user);
        return success ? NoContent() : NotFound();
    }
    
    [HttpDelete("{userID}")]
    public async Task<IActionResult> Delete(int userID) {
        var currentUserId = User.GetUserId();
        if (currentUserId == null || userID != currentUserId) {
            return Forbid();
        }
        var success = await userRepository.DeleteAsync(userID);
        return success ? NoContent() : NotFound();
    }
}