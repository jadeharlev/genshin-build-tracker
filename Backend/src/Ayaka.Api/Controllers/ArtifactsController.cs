using System.Globalization;
using Ayaka.Api.Data.Models;
using Ayaka.Api.Extensions;
using Ayaka.Api.Repositories;
using CsvHelper;
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

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var artifacts = await artifactRepository.GetAllByUserAsync(userId.Value);
        return Ok(artifacts);
    }

    [HttpGet("{artifactID}")]
    public async Task<IActionResult> GetByID(int artifactID) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var artifact = await artifactRepository.GetByIdAsync(artifactID);
        if (artifact == null) return NotFound();
        if(artifact.UserID != userId) return Unauthorized();
        
        return Ok(artifact);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArtifactRequest request) {
        var userId = User.GetUserId();
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
            return StatusCode(500, "Failed to create artifact.");
        }
    }

    [HttpPut("{artifactID}")]
    public async Task<IActionResult> Update(int artifactID, [FromBody] UpdateArtifactRequest request) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        if(artifactID != request.ArtifactID) return BadRequest(new { message = "Artifact ID mismatch" } );
        
        var existingArtifact = await artifactRepository.GetByIdAsync(artifactID);
        if(existingArtifact == null) return NotFound();
        if(existingArtifact.UserID != userId) return Forbid();
        
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
            stat2 = new ArtifactStat {ArtifactStatID = request.SecondStat.ArtifactStatID, StatType = request.SecondStat.StatType, Value = request.SecondStat.Value};
        }
        if (request.ThirdStat != null) {
            stat3 = new ArtifactStat {ArtifactStatID = request.ThirdStat.ArtifactStatID, StatType = request.ThirdStat.StatType, Value = request.ThirdStat.Value};
        }
        if (request.FourthStat != null) {
            stat4 = new ArtifactStat {ArtifactStatID = request.FourthStat.ArtifactStatID, StatType = request.FourthStat.StatType, Value = request.FourthStat.Value};
        }

        try {
            var success = await artifactRepository.UpdateAsync(artifact, stat1, stat2, stat3, stat4);
            if (!success) return BadRequest();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error updating artifact");
            return StatusCode(500, "Failed to update artifact.");
        }
    }

    [HttpDelete("{artifactID}")]
    public async Task<IActionResult> Delete(int artifactID) {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var existingArtifact = await artifactRepository.GetByIdAsync(artifactID);
        if (existingArtifact == null) return NotFound();
        if (existingArtifact.UserID != userId) return Forbid();
        
        try {
            var success = await artifactRepository.DeleteAsync(artifactID);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception e) {
            logger.LogError(e, "Error deleting artifact " + artifactID);
            return StatusCode(500, "Failed to delete artifact.");
        }
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportCSV() {
        var userId =User.GetUserId();
        if (userId == null) return Unauthorized();

        var artifacts = await artifactRepository.GetAllByUserAsync(userId.Value);
        using var memoryStream = new MemoryStream();
        await using var writer = new StreamWriter(memoryStream);
        await using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        
        csv.WriteRecords(artifacts);
        await writer.FlushAsync();
        
        return File(memoryStream.ToArray(), "text/csv", "artifacts.csv");
    }
    
}