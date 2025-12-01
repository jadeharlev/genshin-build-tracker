using System.ComponentModel.DataAnnotations;

namespace Ayaka.Api.Data.Models;

public class CreateArtifactRequest {
    [Required] public string ArtifactType { get; set; }
    [Required] public int Rarity { get; set; }
    [Required] public string SetKey { get; set; }
    [Required] [Range(0, 20)] public int Level { get; set; }
    [Required] public string MainStatType { get; set; }
    [Required] public CreateArtifactStatRequest FirstStat { get; set; } = null!;
    public CreateArtifactStatRequest? SecondStat { get; set; } 
    public CreateArtifactStatRequest? ThirdStat { get; set; }
    public CreateArtifactStatRequest? FourthStat { get; set; }
}

public class CreateArtifactStatRequest {
    [Required] public string StatType { get; set; }
    [Required] public float Value { get; set; }
}

public class UpdateArtifactRequest {
    [Required] public int ArtifactID { get; set; }
    [Required] public string ArtifactType { get; set; }
    [Required] public int Rarity { get; set; }
    [Required] public string SetKey { get; set; }
    [Required] [Range(0, 20)] public int Level { get; set; }
    [Required] public string MainStatType { get; set; }
    [Required] public UpdateArtifactStatRequest FirstStat { get; set; } = null!;
    public UpdateArtifactStatRequest? SecondStat { get; set; } 
    public UpdateArtifactStatRequest? ThirdStat { get; set; }
    public UpdateArtifactStatRequest? FourthStat { get; set; }
}

public class UpdateArtifactStatRequest {
    [Required] public int ArtifactStatID { get; set; }
    [Required] public string StatType { get; set; }
    [Required] public int Value { get; set; }
}