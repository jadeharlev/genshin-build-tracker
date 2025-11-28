using System.Text.Json;
using Ayaka.Api.Data.Models.GameData;
using StackExchange.Redis;

namespace Ayaka.Api.Services.Cache;

public class GameDataCache : IGameDataCache {
    private readonly IConnectionMultiplexer redis;
    private readonly ILogger<GameDataCache> logger;
    private IDatabase database => redis.GetDatabase();

    public GameDataCache(IConnectionMultiplexer redis, ILogger<GameDataCache> logger) {
        this.redis = redis;
        this.logger = logger;
    }
    
    public async Task StoreCharacterAsync(BaseCharacter character) {
        var key = $"base:character:{character.Key}";
        var json = JsonSerializer.Serialize(character);
        await database.StringSetAsync(key, json);
    }

    public async Task<BaseCharacter?> GetCharacterAsync(string key) {
        var redisKey = $"base:character:{key}";
        var json = await database.StringGetAsync(redisKey);
        if (json.IsNullOrEmpty) {
            return null;
        }
        
        return JsonSerializer.Deserialize<BaseCharacter>(json);
    }

    public async Task<List<BaseCharacter>> GetAllCharactersAsync() {
        var server = redis.GetServer(redis.GetEndPoints().First());
        var keys = server.Keys(pattern: "base:character:*").ToList();
        var characters = new List<BaseCharacter>();
        foreach (var key in keys) {
            var json = await database.StringGetAsync(key);
            if (!json.IsNullOrEmpty) {
                var character = JsonSerializer.Deserialize<BaseCharacter>(json);
                if (character != null) {
                    characters.Add(character);
                }
            }
        }
        return characters;
    }

    public async Task<bool> CharacterExistsAsync(string key) {
        return await database.KeyExistsAsync($"base:character:{key}");
    }

    public async Task StoreWeaponAsync(BaseWeapon weapon) {
        var key = $"base:weapon:{weapon.Key}";
        var json = JsonSerializer.Serialize(weapon);
        await database.StringSetAsync(key, json);
    }

    public async Task<BaseWeapon?> GetWeaponAsync(string key) {
        var redisKey = $"base:weapon:{key}";
        var json = await database.StringGetAsync(redisKey);
        if (json.IsNullOrEmpty) {
            return null;
        }
        
        return JsonSerializer.Deserialize<BaseWeapon>(json);
    }

    public async Task<List<BaseWeapon>> GetAllWeaponsAsync() {
        var server = redis.GetServer(redis.GetEndPoints().First());
        var keys = server.Keys(pattern: "base:weapon:*").ToList();
        var weapons = new List<BaseWeapon>();
        foreach (var key in keys) {
            var json = await database.StringGetAsync(key);
            if (!json.IsNullOrEmpty) {
                var weapon = JsonSerializer.Deserialize<BaseWeapon>(json);
                if (weapon != null) {
                    weapons.Add(weapon);
                }
            }
        }
        return weapons;
    }

    public async Task<bool> WeaponExistsAsync(string key) {
        return await database.KeyExistsAsync($"base:weapon:{key}");
    }

    public async Task StoreArtifactSetAsync(BaseArtifactSet artifactSet) {
        var key = $"base:artifact:set:{artifactSet.Key}";
        var json = JsonSerializer.Serialize(artifactSet);
        await database.StringSetAsync(key, json);
    }

    public async Task<BaseArtifactSet?> GetArtifactSetAsync(string key) {
        var redisKey = $"base:artifact:set:{key}";
        var json = await database.StringGetAsync(redisKey);
        if (json.IsNullOrEmpty) {
            return null;
        }
        
        return JsonSerializer.Deserialize<BaseArtifactSet>(json);
    }

    public async Task<List<BaseArtifactSet>> GetAllArtifactSetsAsync() {
        var server = redis.GetServer(redis.GetEndPoints().First());
        var keys = server.Keys(pattern: "base:artifact:set:*").ToList();
        var artifactSets = new List<BaseArtifactSet>();
        foreach (var key in keys) {
            var json = await database.StringGetAsync(key);
            if (!json.IsNullOrEmpty) {
                var artifactSet = JsonSerializer.Deserialize<BaseArtifactSet>(json);
                if (artifactSet != null) {
                    artifactSets.Add(artifactSet);
                }
            }
        }
        return artifactSets;
    }

    public async Task<bool> ArtifactSetExistsAsync(string key) {
        return await database.KeyExistsAsync($"base:artifact:set:{key}");
    }

    public async Task StoreValidationRulesAsync(ValidationRules rules) {
        var key = $"validation:rules";
        var json = JsonSerializer.Serialize(rules);
        await database.StringSetAsync(key, json);
    }

    public async Task<ValidationRules?> GetValidationRulesAsync() {
        var key = "validation:rules";
        var json = await database.StringGetAsync(key);
        if (json.IsNullOrEmpty) {
            return null;
        }
        
        return JsonSerializer.Deserialize<ValidationRules>(json);
    }

    public async Task<bool> IsInitializedAsync() {
        try {
            var server = redis.GetServer(redis.GetEndPoints().First());
            var keys = server.Keys(pattern: "base:character:*", pageSize: 1);
            return keys.Any();
        }
        catch (Exception e) {
            logger.LogWarning(e, "Failed to check initialization status.");
            return false;
        }
    }

    public async Task DeleteCharacterAsync(string key) {
        await database.KeyDeleteAsync($"base:character:{key}");
    }

    public async Task DeleteWeaponAsync(string key) {
        await database.KeyDeleteAsync($"base:weapon:{key}");
    }

    public async Task DeleteArtifactSetAsync(string key) {
        await database.KeyDeleteAsync($"base:artifact:set:{key}");
    }

    public async Task DeleteValidationRulesAsync() {
        await database.KeyDeleteAsync($"validation:rules");
    }
}
