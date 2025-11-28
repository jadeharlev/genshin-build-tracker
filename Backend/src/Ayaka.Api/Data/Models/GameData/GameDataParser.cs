using System.Text.Json;
using Ayaka.Api.Configuration;
using Microsoft.Extensions.Options;

namespace Ayaka.Api.Data.Models.GameData;

public class GameDataParser : IGameDataParser {
    private readonly HttpClient httpClient;
    private readonly ILogger<GameDataParser> logger;
    private readonly GameDataOptions options;
    
    private const string CharactersFileName = "characters.json";
    private const string WeaponsFileName = "weapons.json";
    private const string ArtifactSetsFileName = "artifact_sets.json";

    public GameDataParser(HttpClient httpClient, ILogger<GameDataParser> logger, IOptions<GameDataOptions> options) {
        this.httpClient = httpClient;
        this.logger = logger;
        this.options = options.Value;

        Directory.CreateDirectory(this.options.LocalDataPath);
    }
    
    public async Task<List<BaseCharacter>> ParseCharactersAsync(bool forceRefresh = false) {
        var cacheFilePath = Path.Combine(options.LocalDataPath, CharactersFileName);
        if (!forceRefresh) {
            var (success, cachedData) = await TryLoadFromCacheAsync<List<BaseCharacter>>(cacheFilePath);
            if (success && cachedData != null) {
                logger.LogInformation($"Loaded {cachedData.Count} characters from local cache.");
                return cachedData;
            }
        }
        logger.LogInformation("Fetching characters from API.");
        var characters = await FetchCharactersFromAPIAsync();
        await SaveToCacheAsync(cacheFilePath, characters);
        logger.LogInformation($"Saved {characters.Count} characters to local cache.");
        return characters;
    }

    public async Task<List<BaseWeapon>> ParseWeaponsAsync(bool forceRefresh = false) {
        var cacheFilePath = Path.Combine(options.LocalDataPath, WeaponsFileName);
        if (!forceRefresh) {
            var (success, cachedData) = await TryLoadFromCacheAsync<List<BaseWeapon>>(cacheFilePath);
            if (success && cachedData != null) {
                logger.LogInformation($"Loaded {cachedData.Count} weapons from local cache.");
                return cachedData;
            }
        }
        
        logger.LogInformation("Fetching weapons from API.");
        var weapons = await FetchWeaponsFromAPIAsync();
        
        await SaveToCacheAsync(cacheFilePath, weapons);
        logger.LogInformation($"Saved {weapons.Count} weapons to local cache.");
        return weapons;
    }
    
    public async Task<List<BaseArtifactSet>> ParseArtifactSetsAsync(bool forceRefresh = false) {
        var cacheFilePath = Path.Combine(options.LocalDataPath, ArtifactSetsFileName);
        if (!forceRefresh) {
            var (success, cachedData) = await TryLoadFromCacheAsync<List<BaseArtifactSet>>(cacheFilePath);
            if (success && cachedData != null) {
                logger.LogInformation($"Loaded {cachedData.Count} artifact sets from local cache.");
                return cachedData;
            }
        }
        
        logger.LogInformation("Fetching artifact sets from API.");
        var artifactSets = await FetchArtifactSetsFromAPIAsync();
        
        await SaveToCacheAsync(cacheFilePath, artifactSets);
        logger.LogInformation($"Saved {artifactSets.Count} artifact sets to local cache.");
        return artifactSets;
    }

    public async Task<ValidationRules> ParseValidationRulesAsync() {
        logger.LogInformation("Creating validation rules.");
        var rules = new ValidationRules
        {
            ValidMainStats = new Dictionary<string, List<string>>
            {
                ["Flower"] = new List<string> { "HP" },
                ["Feather"] = new List<string> { "ATK" },
                ["Sands"] = new List<string> { "HP%", "ATK%", "DEF%", "EM", "ER%" },
                ["Goblet"] = new List<string>
                {
                    "HP%", "ATK%", "DEF%", "EM",
                    "Pyro%", "Hydro%", "Cryo%", "Electro%", "Anemo%", "Geo%", "Dendro%", "Physical%"
                },
                ["Circlet"] = new List<string>
                {
                    "HP%", "ATK%", "DEF%", "EM",
                    "CritRate", "CritDMG", "HealingBonus"
                }
            },
            ValidSubstats = new List<string>
            {
                "HP", "HP%", "ATK", "ATK%", "DEF", "DEF%",
                "EM", "ER%", "CritRate", "CritDMG"
            },
            LevelCaps = new Dictionary<string, LevelCap>
            {
                ["1"] = new LevelCap(1, 4),
                ["2"] = new LevelCap(1, 4),
                ["3"] = new LevelCap(1, 12),
                ["4"] = new LevelCap(1, 16),
                ["5"] = new LevelCap(1, 20),
            }
        };
        return await Task.FromResult(rules);
    }
    
    public async Task ClearLocalCacheAsync() {
        logger.LogInformation("Clearing local game data cache.");
        var cacheFiles = new[]
        {
            Path.Combine(options.LocalDataPath, ArtifactSetsFileName),
            Path.Combine(options.LocalDataPath, CharactersFileName),
            Path.Combine(options.LocalDataPath, WeaponsFileName),
        };

        foreach (var filePath in cacheFiles) {
            if (File.Exists(filePath)) {
                File.Delete(filePath);
                logger.LogInformation($"Deleted cache file: {filePath}");
            }
        }
    }
    
    #region Helper Methods

    private async Task<(bool success, T? data)> TryLoadFromCacheAsync<T>(string filePath) where T : class{
        if (!File.Exists(filePath)) {
            logger.LogDebug($"Cache file not found: {filePath}");
            return (false, null);
        }

        var fileInfo = new FileInfo(filePath);
        var fileAge = DateTime.UtcNow - fileInfo.LastWriteTimeUtc;
        if (fileAge.TotalDays > options.CacheExpirationInDays) {
            logger.LogInformation($"Cache file is stale; age is {fileAge.TotalDays:F1} days: {filePath}");
            return (false, null);
        }

        try {
            var json = await File.ReadAllTextAsync(filePath);
            var deserializedData = JsonSerializer.Deserialize<T>(json) ?? default!;

            if (deserializedData == null) {
                logger.LogWarning($"Failed to deserialize cache file: {filePath}");
                return (false, null);
            }

            logger.LogDebug($"Successfully loaded data from cache: {filePath}");
            return (true, deserializedData);
        }
        catch (Exception e) {
            logger.LogError(e, $"Error reading cache file: {filePath}");
            return (false, null);
        }
    }

    private async Task SaveToCacheAsync<T>(string filePath, T data) {
        try {
            var directory = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrEmpty(directory)) {
                Directory.CreateDirectory(directory);
                logger.LogDebug($"Ensured directory exists: {directory}");
            }
            
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            await File.WriteAllTextAsync(filePath, json);
            logger.LogDebug($"Saved cache file: {filePath}");
        }
        catch (Exception e) {
            logger.LogError(e, $"Error saving cache file: {filePath}");
        }
    }
    
    private async Task<List<BaseCharacter>> FetchCharactersFromAPIAsync() {
        try {
            logger.LogInformation("Fetching character data from API.");
            var response = await httpClient.GetStringAsync("https://genshin.jmp.blue/characters");
            var characterKeys = JsonSerializer.Deserialize<List<string>>(response);

            var characters = new List<BaseCharacter>();
            foreach (var characterKey in characterKeys) {
                try {
                    var detailResponse =
                        await httpClient.GetStringAsync($"https://genshin.jmp.blue/characters/{characterKey}");
                    var data = JsonSerializer.Deserialize<JsonElement>(detailResponse);

                    var character = new BaseCharacter
                    {
                        Key = characterKey,
                        Name = data.GetProperty("name").GetString() ?? characterKey,
                        Element = data.GetProperty("vision").GetString() ?? "Unknown",
                        WeaponType = data.GetProperty("weapon").GetString() ?? "Unknown",
                        Rarity = data.GetProperty("rarity").GetInt32(),
                        Region = data.TryGetProperty("nation", out var nation)
                            ? nation.GetString() ?? "Unknown"
                            : "Unknown",
                        Description = data.TryGetProperty("description", out var description)
                            ? description.GetString() ?? ""
                            : "",
                        Icon = $"{characterKey}.png"
                    };

                    characters.Add(character);
                    logger.LogDebug($"Parsed character: {character.Name}");

                    await Task.Delay(options.DelayBetweenAPIRequestsInMs);
                }
                catch (Exception e) {
                    logger.LogError($"Failed to parse character: {characterKey}");
                    throw;
                }

                logger.LogInformation($"Successfully parsed {characters.Count} characters.");
            }
            return characters; 
        }
        catch (Exception e) {
            logger.LogError($"Failed to fetch characters from API: {e.Message}");
            throw;
        }
    }

    public async Task<List<BaseWeapon>> FetchWeaponsFromAPIAsync() {
        try {
            logger.LogInformation("Fetching weapons from API.");
            var response = await httpClient.GetStringAsync("https://genshin.jmp.blue/weapons");
            var weaponKeys = JsonSerializer.Deserialize<List<string>>(response);

            var weapons = new List<BaseWeapon>();
            foreach (var key in weaponKeys) {
                try {
                    var detailResponse = await httpClient.GetStringAsync($"https://genshin.jmp.blue/weapons/{key}");
                    var data = JsonSerializer.Deserialize<JsonElement>(detailResponse);
                    var weapon = new BaseWeapon
                    {
                        Key = key,
                        Name = data.GetProperty("name").GetString() ?? key,
                        WeaponType = data.GetProperty("type").GetString() ?? "Unknown",
                        Rarity = data.GetProperty("rarity").GetInt32(),
                        MainStatValue = 0,
                        SubstatType = data.TryGetProperty("subStat", out var subStat)
                            ? subStat.GetString() ?? ""
                            : "",
                        SubstatValue = 0,
                        Icon = $"{key}.png"
                    };

                    weapons.Add(weapon);
                    logger.LogDebug($"Parsed weapon: {weapon.Name}");

                    await Task.Delay(options.DelayBetweenAPIRequestsInMs);
                }
                catch (Exception e) {
                    logger.LogError($"Failed to fetch weapons from API: {e.Message}");
                }
            }

            return weapons;
        }
        catch (Exception e) {
            logger.LogError($"Failed to fetch weapons from API: {e.Message}");
            throw;
        }
    }

    public async Task<List<BaseArtifactSet>> FetchArtifactSetsFromAPIAsync() {
        try {
            logger.LogInformation("Fetching artifact sets from API.");
            var response = await httpClient.GetStringAsync("https://genshin.jmp.blue/artifacts");
            var artifactSetKeys = JsonSerializer.Deserialize<List<string>>(response);
            var artifactSets = new List<BaseArtifactSet>();
            foreach (var key in artifactSetKeys) {
                try {
                    var detailResponse = await httpClient.GetStringAsync($"https://genshin.jmp.blue/artifacts/{key}");
                    var data = JsonSerializer.Deserialize<JsonElement>(detailResponse);
                    var artifactSet = new BaseArtifactSet
                    {
                        Key = key,
                        Name = data.GetProperty("name").GetString() ?? key,
                        MaxRarity = data.GetProperty("max_rarity").GetInt32(),
                        TwoPieceEffect = data.TryGetProperty("2-piece_bonus", out var two)
                            ? two.GetString() ?? ""
                            : "",
                        FourPieceEffect = data.TryGetProperty("4-piece_bonus", out var four)
                            ? four.GetString() ?? ""
                            : "",
                        FlowerIcon = $"{key}_flower-of-life.png",
                        FeatherIcon = $"{key}_plume-of-death.png",
                        SandsIcon = $"{key}_sands-of-eon.png",
                        GobletIcon = $"{key}_goblet-of-eonothem.png",
                        CircletIcon = $"{key}_circlet-of-logos.png"
                    };
                    
                    artifactSets.Add(artifactSet);
                    logger.LogDebug($"Parsed artifact set: {key}");
                    await Task.Delay(options.DelayBetweenAPIRequestsInMs);
                } catch (Exception e) {
                    logger.LogError($"Failed to fetch artifact set from API: {e.Message}");
                }
            }

            return artifactSets;
        } catch (Exception e) {
            logger.LogError($"Failed to fetch artifact sets from API: {e.Message}");
            throw;
        }
    }
    #endregion
}