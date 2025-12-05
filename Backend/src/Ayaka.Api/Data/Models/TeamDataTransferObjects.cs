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
    
    public TeamCharacterSlot? FirstCharacter { get; set; }
    public TeamCharacterSlot? SecondCharacter { get; set; }
    public TeamCharacterSlot? ThirdCharacter { get; set; }
    public TeamCharacterSlot? FourthCharacter { get; set; }
}

public class CreateTeamRequest {
    [Required]
    public string TeamName { get; set; }
    
    public int? FirstCharacterID { get; set; }
    public int? SecondCharacterID { get; set; }
    public int? ThirdCharacterID { get; set; }
    public int? FourthCharacterID { get; set; }
}

public class UpdateTeamRequest {
    [Required]
    public string TeamName { get; set; }
    
    public int? FirstCharacterID { get; set; }
    public int? SecondCharacterID { get; set; }
    public int? ThirdCharacterID { get; set; }
    public int? FourthCharacterID { get; set; }
}