using System.ComponentModel.DataAnnotations;

namespace Ayaka.Api.Data.Models;

public class BuildWithDetails {
    public int BuildID { get; set; }
    public string BuildName { get; set; }
    public int UserID { get; set; }
    
    public int CharacterID { get; set; }
    public string CharacterName { get; set; }
    public string CharacterKey { get; set; }
    public int CharacterLevel { get; set; }
    
    public int? WeaponID { get; set; }
    public string? WeaponKey { get; set; }
    public int? WeaponLevel { get; set; }
    public int? WeaponRefinement { get; set; }
    
    public int? FlowerID { get; set; }
    public int? FeatherID { get; set; }
    public int? SandsID { get; set; }
    public int? GobletID { get; set; }
    public int? CircletID { get; set; }
    
    // flower and feather are redundant but keeping them as-is for consistency
    public string? FlowerSetKey { get; set; }
    public string? FlowerMainStat { get; set; }
    public int? FlowerLevel { get; set; }
    public int? FlowerRarity { get; set; }
    public string? FeatherSetKey { get; set; }
    public string? FeatherMainStat { get; set; }
    public int? FeatherLevel { get; set; }
    public int? FeatherRarity { get; set; }
    public string? SandsSetKey { get; set; }
    public string? SandsMainStat { get; set; }
    public int? SandsLevel { get; set; }
    public int? SandsRarity { get; set; }
    public string? GobletSetKey { get; set; }
    public string? GobletMainStat { get; set; }
    public int? GobletLevel { get; set; }
    public int? GobletRarity { get; set; }
    public string? CircletSetKey { get; set; }
    public string? CircletMainStat { get; set; }
    public int? CircletLevel { get; set; }
    public int? CircletRarity { get; set; }
}

public class CreateBuildRequest {
    [Required] [MaxLength(255)]
    public string BuildName { get; set; }
    
    [Required]
    public int CharacterID { get; set; }
    
    public int? WeaponID { get; set; }
    public int? FlowerID { get; set; }
    public int? FeatherID { get; set; }
    public int? SandsID { get; set; }
    public int? GobletID { get; set; }
    public int? CircletID { get; set; }
}

public class UpdateBuildRequest {
    [Required] [MaxLength(255)]
    public string BuildName { get; set; }
    
    [Required]
    public int CharacterID { get; set; }
    
    public int? WeaponID { get; set; }
    public int? FlowerID { get; set; }
    public int? FeatherID { get; set; }
    public int? SandsID { get; set; }
    public int? GobletID { get; set; }
    public int? CircletID { get; set; }
}