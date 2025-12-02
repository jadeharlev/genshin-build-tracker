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
    private readonly ILogger<ArtifactsController> logger;
    
    public ArtifactsController(IArtifactRepository artifactRepository, ILogger<ArtifactsController> logger) {
        this.artifactRepository = artifactRepository;
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

        var artifacts = await artifactRepository.GetAllByUserAsync(userId.Value);
        return Ok(artifacts);
    }

    [HttpGet("{artifactID}")]
    public async Task<IActionResult> GetByID(int artifactID) {
        var artifact = await artifactRepository.GetByIdAsync(artifactID);
        if (artifact == null) return NotFound();
        return Ok(artifact);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArtifactRequest request) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var artifact = new Artifact
        {
            ArtifactType = request.ArtifactType,
            Rarity = request.Rarity,
            SetKey = request.SetKey,
            Level = request.Level,
            MainStatType = request.MainStatType,
            UserID = userId.Value,
        };

        var stat1 = new ArtifactStat
        {
            StatType = request.FirstStat.StatType,
            Value = request.FirstStat.Value,
        };
        
        ArtifactStat? stat2 = null;
        ArtifactStat? stat3 = null;
        ArtifactStat? stat4 = null;

        if (request.SecondStat != null) {
            stat2 = new ArtifactStat {StatType = request.SecondStat.StatType, Value = request.SecondStat.Value};
        }
        if (request.ThirdStat != null) {
            stat3 = new ArtifactStat {StatType = request.ThirdStat.StatType, Value = request.ThirdStat.Value};
        }
        if (request.FourthStat != null) {
            stat4 = new ArtifactStat {StatType = request.FourthStat.StatType, Value = request.FourthStat.Value};
        }

        artifact.UserID = userId.Value;

        try {
            var newId = await artifactRepository.CreateAsync(artifact, stat1, stat2, stat3, stat4);
            var createdArtifact = await artifactRepository.GetByIdAsync(newId);
            return CreatedAtAction(nameof(GetByID), new { artifactID = newId }, createdArtifact);
        }
        catch (Exception e) {
            logger.LogError(e, "Error creating artifact");
            return StatusCode(500, "Failed to create artifact: " + e.Message);
        }
    }

    [HttpPut("{artifactID}")]
    public async Task<IActionResult> Update(int artifactID, [FromBody] UpdateArtifactRequest request) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        if(artifactID != request.ArtifactID) return BadRequest(new { message = "Artifact ID mismatch" } );
        
        var existingArtifact = await artifactRepository.GetByIdAsync(artifactID);
        if(existingArtifact == null) return NotFound();
        
        var artifact = new Artifact {
            ArtifactId = artifactID,
            ArtifactType = request.ArtifactType,
            Rarity = request.Rarity,
            SetKey = request.SetKey,
            Level = request.Level,
            MainStatType = request.MainStatType,
            UserID = userId.Value,
            FirstArtifactStatID = existingArtifact.FirstStat.ArtifactStatID,
            SecondArtifactStatID = existingArtifact.SecondStat?.ArtifactStatID,
            ThirdArtifactStatID = existingArtifact.ThirdStat?.ArtifactStatID,
            FourthArtifactStatID = existingArtifact.FourthStat?.ArtifactStatID
        };
        
        var stat1 = new ArtifactStat
        {
            ArtifactStatID = request.FirstStat.ArtifactStatID,
            StatType = request.FirstStat.StatType,
            Value = request.FirstStat.Value,
        };
        
        ArtifactStat? stat2 = null;
        ArtifactStat? stat3 = null;
        ArtifactStat? stat4 = null;

        if (request.SecondStat != null) {
            stat2 = new ArtifactStat {ArtifactStatID = request.SecondStat.Value, StatType = request.SecondStat.StatType, Value = request.SecondStat.Value};
        }
        if (request.ThirdStat != null) {
            stat3 = new ArtifactStat {ArtifactStatID = request.ThirdStat.Value, StatType = request.ThirdStat.StatType, Value = request.ThirdStat.Value};
        }
        if (request.FourthStat != null) {
            stat4 = new ArtifactStat {ArtifactStatID = request.FourthStat.Value, StatType = request.FourthStat.StatType, Value = request.FourthStat.Value};
        }

        try {
            var success = await artifactRepository.UpdateAsync(artifact, stat1, stat2, stat3, stat4);
            if (!success) return BadRequest();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating artifact");
            return StatusCode(500, "Failed to update artifact: " + e.Message);
        }
    }

    [HttpDelete("{artifactID}")]
    public async Task<IActionResult> Delete(int artifactID) {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        
        var existingArtifact = await artifactRepository.GetByIdAsync(artifactID);
        if(existingArtifact == null) return NotFound();
        try {
            var success = await artifactRepository.DeleteAsync(artifactID);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting artifact " + artifactID);
            return StatusCode(500, "Failed to delete artifact: " + e.Message);
        }
    }
    
}