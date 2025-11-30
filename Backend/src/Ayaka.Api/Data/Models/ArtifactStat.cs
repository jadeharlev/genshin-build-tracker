using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/*
 `ArtifactStatID` int NOT NULL AUTO_INCREMENT,
 `StatType` enum('ATK%','ATK','HP%','HP','DEF%','DEF','EM','ER%','Pyro%','Dendro%','Anemo%','Electro%','Cryo%','Hydro%','Physical%','HealingBonus','CritRate','CritDMG') NOT NULL,
 `Value` decimal(5,2) NOT NULL,
 PRIMARY KEY (`ArtifactStatID`)
 */

[Table("artifactstat")]
public class ArtifactStat {
    [Key]
    public int ArtifactStatID { get; set; }

    [Required] 
    public string StatType { get; set; } = string.Empty;

    [Required] 
    public float Value;

}