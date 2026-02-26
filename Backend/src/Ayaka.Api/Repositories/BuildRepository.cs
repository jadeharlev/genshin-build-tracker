using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

/**
 * CREATE VIEW v_buildswithdetails AS
    SELECT b.BuildID, b.BuildName, b.UserID,
           b.CharacterID, c.Name AS CharacterName,
           c.BaseCharacterKey AS CharacterKey,
           c.Level AS CharacterLevel,
           b.WeaponID,
           w.BaseWeaponKey AS WeaponKey,
           w.Level AS WeaponLevel,
           w.Refinement AS WeaponRefinement,
           b.FlowerID, b.FeatherID, b.SandsID, b.GobletID, b.CircletID,
           a1.SetKey AS FlowerSetKey,
           a1.MainStatType AS FlowerMainStat,
           a1.Level AS FlowerLevel,
           a1.Rarity AS FlowerRarity,
           a2.SetKey AS FeatherSetKey,
           a2.MainStatType AS FeatherMainStat,
           a2.Level AS FeatherLevel,
           a2.Rarity AS FeatherRarity,
           a3.SetKey AS SandsSetKey,
           a3.MainStatType AS SandsMainStat,
           a3.Level AS SandsLevel,
           a3.Rarity AS SandsRarity,
           a4.SetKey AS GobletSetKey,
           a4.MainStatType AS GobletMainStat,
           a4.Level AS GobletLevel,
           a4.Rarity AS GobletRarity,
           a5.SetKey AS CircletSetKey,
           a5.MainStatType AS CircletMainStat,
           a5.Level AS CircletLevel,
           a5.Rarity AS CircletRarity
    FROM build b
    INNER JOIN characters c on b.CharacterID = c.CharacterID
    LEFT JOIN weapon w on b.WeaponID = w.WeaponID
    LEFT JOIN artifact a1 ON b.FlowerID = a1.ArtifactID
    LEFT JOIN artifact a2 ON b.FeatherID = a2.ArtifactID
    LEFT JOIN artifact a3 ON b.SandsID = a3.ArtifactID
    LEFT JOIN artifact a4 ON b.GobletID = a4.ArtifactID
    LEFT JOIN artifact a5 ON b.CircletID = a5.ArtifactID;
 */

public class BuildRepository : IBuildRepository {
    private readonly string connectionString;
    
    public BuildRepository(IConfiguration configuration) {
        this.connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<IEnumerable<BuildWithDetails>> GetAllByUserAsync(int userId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_buildswithdetails
                                  WHERE UserID = @userId;
                                  """;
        
        using var connection = CreateConnection();
        return await connection.QueryAsync<BuildWithDetails>(sqlCommand, new { userId });
    }

    public async Task<BuildWithDetails?> GetByIdAsync(int buildId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_buildswithdetails
                                  WHERE BuildID = @buildId;
                                  """;
        
        using var connection = CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<BuildWithDetails>(sqlCommand, new { buildId });
    }

    public async Task<int> CreateAsync(Build build) {
        const string sqlCommand = """
                                  INSERT INTO build(BuildName, CharacterID, FlowerID, FeatherID, SandsID, GobletID, CircletID, UserID, WeaponID) 
                                  VALUES(@BuildName, @CharacterID, @FlowerID, @FeatherID, @SandsID, @GobletID, @CircletID, @UserID, @WeaponID);

                                  SELECT LAST_INSERT_ID();
                                  """;
        
        using var connection = CreateConnection();
        return await connection.QuerySingleAsync<int>(sqlCommand, build);
    }

    public async Task<bool> UpdateAsync(Build build) {
        const string sqlCommand = """
                                  UPDATE build
                                  SET BuildName = @BuildName,
                                      CharacterID = @CharacterID,
                                      WeaponID = @WeaponID,
                                      FlowerID = @FlowerID,
                                      FeatherID = @FeatherID,
                                      SandsID = @SandsID,
                                      GobletID = @GobletID,
                                      CircletID = @CircletID
                                  WHERE BuildID = @BuildId AND UserID = @UserId;
                                  """;
        
        using var connection = CreateConnection();
        return await connection.ExecuteAsync(sqlCommand, build) > 0;
    }

    public async Task<bool> DeleteAsync(int buildId, int userId) {
        const string sqlCommand = """
                                  DELETE FROM build
                                  WHERE BuildID = @buildId AND UserID = @UserId;
                                  """;

        using var connection = CreateConnection();
        return await connection.ExecuteAsync(sqlCommand, new { buildId, userId }) > 0;
    }
}