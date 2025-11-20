using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/**
    UserID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    AdventureRank INT NOT NULL,
    AccountName VARCHAR(255) NOT NULL
 */
[Table("user")]
public class User {
    [Key]
    public int UserID { get; set; }

    [Required] 
    public int AdventureRank { get; set; }

    [Required] [MaxLength(255)] 
    public string AccountName { get; set; } = string.Empty;
}