using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/**
    CharacterID         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    BaseCharacterID     INT             NOT NULL,
    Rarity              ENUM('4', '5')  NOT NULL,
    Name                VARCHAR(30)     NOT NULL,
    Level               INT             NOT NULL,
    Ascension           INT             NOT NULL,
    TalentLevel1        INT             NOT NULL,
    TalentLevel2        INT             NOT NULL,
    TalentLevel3        INT             NOT NULL,
    ConstellationLevel  INT             NOT NULL,
    UserID              INT             NOT NULL REFERENCES user,
 */

[Table("characters")]
public class Character {
    [Key]
    public int CharacterID { get; set; }
    
    [Required]
    public int BaseCharacterId { get; set; }

    [Required] // "4" or "5" 
    public string Rarity { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int Level { get; set; }

    [Required] 
    public int Ascension { get; set; }
    
    [Required]
    public int TalentLevel1 { get; set; }
    
    [Required]
    public int TalentLevel2 { get; set; }
    
    [Required]
    public int TalentLevel3 { get; set; }
    
    [Required]
    public int ConstellationLevel { get; set; }
    
    [Required] 
    public int UserID { get; set; }
}