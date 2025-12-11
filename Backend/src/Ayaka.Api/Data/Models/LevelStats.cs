namespace Ayaka.Api.Data.Models;

/**
 * generated DDL from Rider:
        select avg(`ayaka_db`.`weapon`.`Level`)                                   AS `AverageWeaponLevel`,
       (select avg(`ayaka_db`.`characters`.`Level`) from `ayaka_db`.`characters`) AS `AverageCharacterLevel`,
       (select avg(`ayaka_db`.`artifact`.`Level`) from `ayaka_db`.`artifact`)     AS `AverageArtifactLevel`
 */

public class LevelStats {
    public decimal AverageWeaponLevel { get; set; }
    public decimal AverageCharacterLevel { get; set; }
    public decimal AverageArtifactLevel { get; set; }
}