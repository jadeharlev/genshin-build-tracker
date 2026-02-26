using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;
/**
 * Rider-generated DDL recreation (removed foreign keys for brevity)
(
    BuildID     int auto_increment primary key,
    BuildName   varchar(255) not null,
    CharacterID int          not null,
    FlowerID    int          null,
    FeatherID   int          null,
    SandsID     int          null,
    GobletID    int          null,
    CircletID   int          null,
    UserID      int          not null,
    WeaponID    int          null,
 */

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