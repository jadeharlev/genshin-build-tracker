using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/**
     UserID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     GoogleID VARCHAR(255) NOT NULL,
     Email VARCHAR(255) NOT NULL,
     DisplayName VARCHAR(255) NOT NULL,
     AdventureRank INT,
     AccountName VARCHAR(255)
 */
[Table("user")]
public class User {
    [Key]
    public int UserID { get; set; }

    [Required] 
    public string GoogleID { get; set; } = string.Empty;

    [Required] [MaxLength(255)] 
    public string Email { get; set; } = string.Empty;

    [Required] [MaxLength(255)] 
    public string DisplayName { get; set; } = string.Empty;
    
    public int? AdventureRank { get; set; }

    [MaxLength(255)] 
    public string? AccountName { get; set; } = string.Empty;
}