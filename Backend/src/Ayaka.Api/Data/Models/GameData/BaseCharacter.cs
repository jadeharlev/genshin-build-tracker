namespace Ayaka.Api.Data.Models.GameData;
public class BaseCharacter {
    // GOOD format key equivalent
    public string Key { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    public string Element { get; set; } = string.Empty;
    public string WeaponType { get; set; } = string.Empty;
    public int Rarity { get; set; }
    public string Region { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // filename (not path)
    public string Icon { get; set; } = string.Empty;
}