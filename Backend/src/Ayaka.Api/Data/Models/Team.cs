using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/**
  `TeamID` int NOT NULL AUTO_INCREMENT,
  `TeamName` varchar(255) NOT NULL,
  `FirstCharacterID` int DEFAULT NULL,
  `SecondCharacterID` int DEFAULT NULL,
  `ThirdCharacterID` int DEFAULT NULL,
  `FourthCharacterID` int DEFAULT NULL,
  `UserID` int NOT NULL,
 */

[Table("team")]
public class Team {
    [Key]
    public int TeamID { get; set; }
    
    [Required]
    public string TeamName { get; set; } = string.Empty;
    
    public int? FirstCharacterID { get; set; }
    public int? SecondCharacterID { get; set; }
    public int? ThirdCharacterID { get; set; }
    public int? FourthCharacterID { get; set; }

    [Required]
    public int UserID { get; set; }
}