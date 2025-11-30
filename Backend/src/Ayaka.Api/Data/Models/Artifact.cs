using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/*
    `ArtifactID` int NOT NULL AUTO_INCREMENT,
    `ArtifactType` enum('Flower','Feather','Goblet','Sands','Circlet') NOT NULL,
    `Rarity` enum('1','2','3','4','5') NOT NULL,
    `SetKey` varchar(50) NOT NULL,
    `Level` int NOT NULL,
    `MainStatType` enum('ATK%','ATK','HP%','HP','DEF%','EM','ER%','Pyro%','Dendro%','Anemo%','Electro%','Cryo%','Hydro%','Physical%','HealingBonus','CritRate','CritDMG') NOT NULL,
    `FirstArtifactStatID` int NOT NULL,
    `SecondArtifactStatID` int NOT NULL,
    `ThirdArtifactStatID` int NOT NULL,
    `FourthArtifactStatID` int NOT NULL,
    PRIMARY KEY (`ArtifactID`)
*/

[Table("artifact")]
public class Artifact {
    [Key]
    public int ArtifactId { get; set; }
    
    [Required]
    public string ArtifactType { get; set; }
    
    //1..5
    [Required]
    public int Rarity { get; set; }
    
    // link to base set
    [Required]
    public string SetKey { get; set; }
    
    [Required]
    public int Level { get; set; }
    
    [Required]
    public string MainStatType { get; set; }
    
    [Required]
    public int FirstArtifactStatID { get; set; }
    
    public int? SecondArtifactStatID { get; set; }
    
    public int? ThirdArtifactStatID { get; set; }
    
    public int? FourthArtifactStatID { get; set; }
    
    [Required]
    public int UserID { get; set; }
}