namespace Ayaka.Api.Data.Models.GameData;
public class BaseWeapon {
    // GOOD format key equivalent
    public string Key { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    public string WeaponType { get; set; } = string.Empty;
    public int Rarity { get; set; }
    public double MainStatValue { get; set; }
    public string SubstatType { get; set; } = string.Empty;
    public double SubstatValue { get; set; }
    
    // filename (not path)
    public string Icon { get; set; } = string.Empty;
}