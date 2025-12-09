using System.ComponentModel.DataAnnotations;

namespace Ayaka.Api.Data.Models;

public class TeamCharacterSlot {
    public int? CharacterID { get; set; }
    public string? BaseCharacterKey { get; set; }
    public int? Level { get; set; }
}

public class TeamWithCharacters {
    public int TeamID { get; set; }
    public string TeamName { get; set; } 
    public int UserID { get; set; }
    
    public int? FirstCharacterID { get; set; }
    public string? FirstCharacterKey { get; set; }
    public string? FirstCharacterName { get; set; }
    public int? FirstCharacterLevel { get; set; }
    
    public int? SecondCharacterID { get; set; }
    public string? SecondCharacterKey { get; set; }
    public string? SecondCharacterName { get; set; }
    public int? SecondCharacterLevel { get; set; }
    
    public int? ThirdCharacterID { get; set; }
    public string? ThirdCharacterKey { get; set; }
    public string? ThirdCharacterName { get; set; }
    public int? ThirdCharacterLevel { get; set; }
    
    public int? FourthCharacterID { get; set; }
    public string? FourthCharacterKey { get; set; }
    public string? FourthCharacterName { get; set; }
    public int? FourthCharacterLevel { get; set; }
}

public class CreateTeamRequest {
    [Required]
    [MaxLength(255)]
    public string TeamName { get; set; }
    
    public int? FirstCharacterID { get; set; }
    public int? SecondCharacterID { get; set; }
    public int? ThirdCharacterID { get; set; }
    public int? FourthCharacterID { get; set; }
}

public class UpdateTeamRequest {
    [Required]
    [MaxLength(255)]
    public string TeamName { get; set; }
    
    public int? FirstCharacterID { get; set; }
    public int? SecondCharacterID { get; set; }
    public int? ThirdCharacterID { get; set; }
    public int? FourthCharacterID { get; set; }
}