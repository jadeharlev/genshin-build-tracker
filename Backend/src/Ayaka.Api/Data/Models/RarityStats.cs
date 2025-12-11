namespace Ayaka.Api.Data;

/**
 * CREATE VIEW v_charactersbyrarity AS
     SELECT characters.Rarity, COUNT(*) as NumberOfCharacters
     FROM characters
     GROUP BY characters.Rarity;
 */

public class RarityStats {
    public int Rarity { get; set; }
    public int NumberOfCharacters { get; set; }
}