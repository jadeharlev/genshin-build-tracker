namespace Ayaka.Api.Data.Models.GameData;

public interface IGameDataParser {
    Task<List<BaseCharacter>> ParseCharactersAsync(bool forceRefresh = false);
    Task<List<BaseWeapon>> ParseWeaponsAsync(bool forceRefresh = false);
    Task<List<BaseArtifactSet>> ParseArtifactSetsAsync(bool forceRefresh = false);
    Task<ValidationRules> ParseValidationRulesAsync();
    Task ClearLocalCacheAsync();
}