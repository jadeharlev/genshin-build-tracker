using Ayaka.Api.Data.Models.GameData;

namespace Ayaka.Api.Services.Cache;

public interface IGameDataCache {
    Task StoreCharacterAsync(BaseCharacter character);
    Task<BaseCharacter?> GetCharacterAsync(string key);
    Task<List<BaseCharacter>> GetAllCharactersAsync();
    Task<bool> CharacterExistsAsync(string key);

    Task StoreWeaponAsync(BaseWeapon weapon);
    Task<BaseWeapon?> GetWeaponAsync(string key);
    Task<List<BaseWeapon>> GetAllWeaponsAsync();
    Task<bool> WeaponExistsAsync(string key);
    
    Task StoreArtifactSetAsync(BaseArtifactSet artifactSet);
    Task<BaseArtifactSet?> GetArtifactSetAsync(string key);
    Task<List<BaseArtifactSet>> GetAllArtifactSetsAsync();
    Task<bool> ArtifactSetExistsAsync(string key);
    
    Task StoreValidationRulesAsync(ValidationRules rules);
    Task<ValidationRules?> GetValidationRulesAsync();

    Task<bool> IsInitializedAsync();
    
    Task DeleteCharacterAsync(string key);
    Task DeleteWeaponAsync(string key);
    Task DeleteArtifactSetAsync(string key);
    Task DeleteValidationRulesAsync();
}