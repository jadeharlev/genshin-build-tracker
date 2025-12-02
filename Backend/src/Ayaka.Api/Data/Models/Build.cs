using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

[Table("build")]
public class Build {
    [Key]
    public string BuildID { get; set; }
    [Required]
    public string BuildName { get; set; }
    [Required]
    public int CharacterID { get; set; }
    [Required]
    public int FlowerID { get; set; }
    [Required]
    public int FeatherID { get; set; }
    [Required]
    public int SandsID { get; set; }
    [Required] 
    public int CircletID { get; set; }
    [Required]
    public int UserID { get; set; }
    [Required]
    public int WeaponID { get; set; }
}