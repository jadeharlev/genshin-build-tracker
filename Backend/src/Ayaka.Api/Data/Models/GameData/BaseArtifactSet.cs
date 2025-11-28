namespace Ayaka.Api.Data.Models.GameData;
public class BaseArtifactSet {
    // GOOD format key equivalent
    public string Key { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    // can't get 5 star artifacts for sets like Instructor
    public int MaxRarity { get; set; }

    public string TwoPieceEffect { get; set; } = string.Empty;
    public string FourPieceEffect { get; set; } = string.Empty;
    
    // filenames (not paths)
    public string FlowerIcon { get; set; } = string.Empty;
    public string FeatherIcon { get; set; } = string.Empty;
    public string SandsIcon { get; set; } = string.Empty;
    public string GobletIcon { get; set; } = string.Empty;
    public string CircletIcon { get; set; } = string.Empty;
}