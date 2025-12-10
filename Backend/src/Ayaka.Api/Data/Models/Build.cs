using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

[Table("build")]
public class Build {
    [Key]
    public int BuildID { get; set; }
    [Required]
    public string BuildName { get; set; }
    [Required]
    public int CharacterID { get; set; }
    public int? FlowerID { get; set; }
    public int? FeatherID { get; set; }
    public int? SandsID { get; set; }
    public int? GobletID { get; set; }
    public int? CircletID { get; set; }
    public int? WeaponID { get; set; }
    [Required]
    public int UserID { get; set; }
}