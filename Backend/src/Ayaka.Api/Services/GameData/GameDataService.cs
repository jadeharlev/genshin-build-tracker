using Ayaka.Api.Configuration;
using Ayaka.Api.Data.Models.GameData;
using Ayaka.Api.Services.Cache;
using Microsoft.Extensions.Options;

namespace Ayaka.Api.Services.GameData;

public class GameDataService : IGameDataService {
    private readonly IGameDataParser parser;
    private readonly IImageDownloader imageDownloader;
    private readonly IGameDataCache cache;
    private readonly ILogger<GameDataService> logger;
    private readonly GameDataOptions options;

    public GameDataService(IGameDataParser parser, IImageDownloader imageDownloader, IGameDataCache cache,
        ILogger<GameDataService> logger, IOptions<GameDataOptions> options) {
        this.parser = parser;
        this.imageDownloader = imageDownloader;
        this.cache = cache;
        this.logger = logger;
        this.options = options.Value;
    }
    
    public async Task InitializeAsync() {
        logger.LogInformation("Starting game data initialization.");

        var forceRefresh = options.RefreshDataOnStartup;

        if (forceRefresh) {
            logger.LogInformation("Force refresh enabled; fetching from API.");
        }
        
        logger.LogInformation("Parsing character data.");
        var characters = await parser.ParseCharactersAsync(forceRefresh);
        
        logger.LogInformation("Parsing weapon data.");
        var weapons = await parser.ParseWeaponsAsync(forceRefresh);
        
        logger.LogInformation("Parsing artifact set data.");
        var artifactSets = await parser.ParseArtifactSetsAsync(forceRefresh);
        
        logger.LogInformation("Parsing validation rules.");
        var validationRules = await parser.ParseValidationRulesAsync();

        logger.LogInformation("Storing characters in cache.");
        foreach (var character in characters) {
            if (!await cache.CharacterExistsAsync(character.Key)) {
                await cache.StoreCharacterAsync(character);
                logger.LogDebug($"Character {character.Name} stored in Redis.");
            }
            else {
                logger.LogInformation($"Character {character.Name} already cached.");
            }
        }

        logger.LogInformation("Storing weapons in cache.");
        foreach (var weapon in weapons) {
            if (!await cache.WeaponExistsAsync(weapon.Key)) {
                await cache.StoreWeaponAsync(weapon);
                logger.LogDebug($"Weapon {weapon.Name} stored.");
            }
            else {
                logger.LogInformation($"Weapon {weapon.Name} already cached.");
            }
        }

        foreach (var artifact in artifactSets) {
            if (!await cache.ArtifactSetExistsAsync(artifact.Key)) {
                await cache.StoreArtifactSetAsync(artifact);
                logger.LogDebug($"Artifact set {artifact.Name} stored in Redis.");
            }
            else {
                logger.LogInformation($"Artifact set {artifact.Name} already cached.");
            }
        }
        
        await cache.StoreValidationRulesAsync(validationRules);
        
        logger.LogInformation("Downloading images.");
        await imageDownloader.DownloadCharacterImagesAsync(characters);
        await imageDownloader.DownloadWeaponImagesAsync(weapons);
        await imageDownloader.DownloadArtifactImagesAsync(artifactSets);
        
        logger.LogInformation("Game data initialization complete.");
    }

    public async Task<bool> IsInitializedAsync() {
        var hasCharacters = (await cache.GetAllCharactersAsync()).Any();
        var hasWeapons = (await cache.GetAllWeaponsAsync()).Any();
        var hasArtifacts = (await cache.GetAllArtifactSetsAsync()).Any();
        var hasValidationRules = (await cache.GetValidationRulesAsync() != null);

        var isInitialized = hasCharacters && hasWeapons && hasArtifacts && hasValidationRules;
        return isInitialized;
    }

    public async Task RefreshDataAsync() {
        logger.LogInformation("Refreshing game data -- clearing existing data.");
        await ClearAllDataAsync();
        await parser.ClearLocalCacheAsync();
        
        logger.LogInformation("Re-initializing game data from API.");
        var characters = await parser.ParseCharactersAsync(true);
        var weapons = await parser.ParseWeaponsAsync(true);
        var artifactSets = await parser.ParseArtifactSetsAsync(true);
        var validationRules = await parser.ParseValidationRulesAsync();

        foreach (var character in characters) {
            await cache.StoreCharacterAsync(character);
        }

        foreach (var weapon in weapons) {
            await cache.StoreWeaponAsync(weapon);
        }

        foreach (var artifactSet in artifactSets) {
            await cache.StoreArtifactSetAsync(artifactSet);
        }
        
        await cache.StoreValidationRulesAsync(validationRules);
        
        await imageDownloader.DownloadCharacterImagesAsync(characters);
        await imageDownloader.DownloadWeaponImagesAsync(weapons);
        await imageDownloader.DownloadArtifactImagesAsync(artifactSets);
        
        logger.LogInformation("Data refresh complete!");
    }

    private async Task ClearAllDataAsync() {
        try {
            var characters = await cache.GetAllCharactersAsync();
            var weapons = await cache.GetAllWeaponsAsync();
            var artifacts = await cache.GetAllArtifactSetsAsync();

            foreach (var character in characters) {
                await cache.DeleteCharacterAsync(character.Key);
            }

            foreach (var weapon in weapons) {
                await cache.DeleteWeaponAsync(weapon.Key);
            }

            foreach (var artifact in artifacts) {
                await cache.DeleteWeaponAsync(artifact.Key);
            }

            await cache.DeleteValidationRulesAsync();
            logger.LogInformation("Cleared all game data from cache.");
        }
        catch (Exception e) {
            logger.LogError(e, "Error clearing game data from Redis!");
        }
    }
}