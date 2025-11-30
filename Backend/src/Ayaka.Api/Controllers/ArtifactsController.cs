using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ayaka.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ArtifactsController : ControllerBase {
    private readonly IArtifactRepository artifactRepository;
    
    public ArtifactsController(IArtifactRepository artifactRepository) {
        this.artifactRepository = artifactRepository;
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

        var artifacts = await artifactRepository.GetAllByUserAsync(userId.Value);
        return Ok(artifacts);
    }

    [HttpGet("{artifactID}")]
    public async Task<IActionResult> GetByID(int artifactID) {
        var artifacts = await artifactRepository.GetByIdAsync(artifactID);
        if (artifacts == null) return NotFound();
        return Ok(artifacts);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Artifact artifact, [FromBody] ArtifactStat stat1, [FromBody] ArtifactStat stat2, [FromBody] ArtifactStat stat3, [FromBody] ArtifactStat stat4) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        artifact.UserID = userId.Value;

        var newId = await artifactRepository.CreateAsync(artifact, stat1, stat2, stat3, stat4);
        artifact.ArtifactId = newId;
        return CreatedAtAction(nameof(GetByID), new { artifactID = newId }, artifact);
    }

    [HttpPut("{artifactID}")]
    public async Task<IActionResult> Update(int artifactID, [FromBody] Artifact artifact, [FromBody] ArtifactStat stat1, [FromBody] ArtifactStat stat2, [FromBody] ArtifactStat stat3, [FromBody] ArtifactStat stat4) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if(artifactID != artifact.ArtifactId) return BadRequest();
        
        var existingArtifact = await artifactRepository.GetByIdAsync(artifactID);
        if(existingArtifact == null) return NotFound();
        artifact.UserID = userId.Value;
        
        var success = await artifactRepository.UpdateAsync(artifact, stat1, stat2, stat3, stat4);
        if (!success) return BadRequest();
        return NoContent();
    }
    
}