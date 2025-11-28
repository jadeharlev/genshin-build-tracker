namespace Ayaka.Api.Data.Models.GameData;
public class ValidationRules {
    public Dictionary<string, List<string>> ValidMainStats { get; set; } = new();
    public List<string> ValidSubstats { get; set; } = new();
    public Dictionary<string, LevelCap> LevelCaps { get; set; } = new();
}

public class LevelCap(int min, int max) {
    public int Min { get; set; } = min;
    public int Max { get; set; } = max;
}