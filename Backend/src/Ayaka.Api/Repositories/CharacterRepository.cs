using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

public class CharacterRepository : ICharacterRepository {
    private readonly string connectionString;

    public CharacterRepository(IConfiguration configuration) {
        connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }
    
    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }

    public async Task<IEnumerable<Character>> GetAllAsync() {
        const string sqlCommand = """
                                  SELECT * 
                                  FROM characters
                                  """;
        using var connection = CreateConnection();
        return await connection.QueryAsync<Character>(sqlCommand);
    }

    public async Task<Character?> GetByIDAsync(int characterID) {
        const string sqlCommand = """
                                  SELECT * 
                                  FROM characters 
                                  WHERE CharacterID = @CharacterID
                                  """;
        using var connection = CreateConnection();
        var character = await connection.QuerySingleOrDefaultAsync<Character>(sqlCommand, new
        {
            characterID
        });
        return character;
    }

    public async Task<int> CreateAsync(Character character) {
        const string sqlCommand = """
                                  INSERT INTO characters (BaseCharacterID, Rarity, Name, Level, Ascension, TalentLevel1, TalentLevel2, TalentLevel3, ConstellationLevel, UserID) 
                                  VALUES (@BaseCharacterID, @Rarity, @Name, @Level, @Ascension, @TalentLevel1, @TalentLevel2, @TalentLevel3, @ConstellationLevel, @UserID);
                                  
                                  SELECT LAST_INSERT_ID();
                                  """;
        using var connection = CreateConnection();
        var newID = await connection.QuerySingleAsync<int>(sqlCommand, character);
        return newID;
    }

    public async Task<bool> UpdateAsync(Character character) {
        const string sqlCommand = """
                                  UPDATE characters
                                    SET BaseCharacterID = @BaseCharacterID,
                                        Rarity = @Rarity,
                                        Name = @Name,
                                        Level = @Level,
                                        Ascension = @Ascension,
                                        TalentLevel1 = @TalentLevel1,
                                        TalentLevel2 = @TalentLevel2,
                                        TalentLevel3 = @TalentLevel3,
                                        ConstellationLevel = @ConstellationLevel,
                                        UserID = @UserID
                                    WHERE CharacterID = @CharacterID
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, character);
        return affectedRows > 0;
    }

    public async Task<bool> DeleteAsync(int characterID) {
        const string sqlCommand = """
                                  DELETE FROM characters 
                                  WHERE CharacterID = @characterID
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, new { CharacterID = characterID });
        return affectedRows > 0;
    }
}