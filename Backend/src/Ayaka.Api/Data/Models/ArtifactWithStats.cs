namespace Ayaka.Api.Data.Models;

public class ArtifactWithStats {
    public int ArtifactId { get; set; }
    public string ArtifactType { get; set; }
    public int Rarity { get; set; }
    public string SetKey { get; set; }
    public int Level { get; set; }
    public string MainStatType { get; set; }

    public ArtifactStat FirstStat;
    public ArtifactStat? SecondStat;
    public ArtifactStat? ThirdStat;
    public ArtifactStat? FourthStat;
}