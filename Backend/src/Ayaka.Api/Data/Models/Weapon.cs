using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ayaka.Api.Data.Models;

/**
    WeaponID      int auto_increment primary key,
    BaseWeaponKey varchar(50)                                              not null,
    Level         int                                                      not null,
    Ascension     int                                                      not null,
    Refinement    int                                                      not null,
    UserID        int                                                      not null,
    constraint weapon_ibfk_1 foreign key (UserID) references ayaka_db.user (UserID)
 */

[Table("weapon")]
public class Weapon {
    [Key]
    public int WeaponID { get; set; }
    
    [Required]
    public string BaseWeaponKey { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public int Level { get; set; }
    
    [Required]
    public int Ascension { get; set; }
    
    [Required]
    public int Refinement { get; set; }
    
    [Required]
    public int UserID { get; set; }
}