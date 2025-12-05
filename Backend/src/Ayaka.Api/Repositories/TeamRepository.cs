using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

public class TeamRepository : ITeamRepository {
    private readonly string connectionString;

    public TeamRepository(IConfiguration configuration) {
        connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }
    
    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<IEnumerable<TeamWithCharacters>> GetAllByUserAsync(int userId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_teamswithcharacters
                                  WHERE UserId = @userId;
                                  """;
        
        using var connection = CreateConnection();
        var result = await connection.QueryAsync<dynamic>(sqlCommand, new { userId });

        return result.Select(MapToTeamWithCharacters).ToList();
    }

    public async Task<TeamWithCharacters?> GetByIdAsync(int teamId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_teamswithcharacters
                                  WHERE TeamId = @teamId;
                                  """;
        
        using var connection = CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(sqlCommand, new { teamId });

        if (result == null) return result;
        return MapToTeamWithCharacters(result);
    }

    public async Task<int> CreateAsync(Team team) {
        const string sqlCommand = """
                                  INSERT INTO team (TeamName, FirstCharacterID, SecondCharacterID, ThirdCharacterID, FourthCharacterID, UserID)
                                  VALUES (@TeamName, @FirstCharacterID, @SecondCharacterID, @ThirdCharacterID, @FourthCharacterID, @UserID);
                                  SELECT LAST_INSERT_ID();
                                  """;
        
        using var connection = CreateConnection();
        return await connection.QuerySingleAsync<int>(sqlCommand, team);
    }

    public async Task<bool> UpdateAsync(Team team) {
        const string sqlCommand = """
                                  UPDATE team
                                  SET TeamName = @TeamName,
                                      FirstCharacterID = @FirstCharacterID,
                                      SecondCharacterID = @SecondCharacterID,
                                      ThirdCharacterID = @ThirdCharacterID,
                                      FourthCharacterID = @FourthCharacterID
                                  WHERE TeamId = @TeamId AND UserID = @UserID;
                                  """;
        using var connection = CreateConnection();
        return await connection.ExecuteAsync(sqlCommand, team) > 0;
    }

    public async Task<bool> DeleteAsync(int teamId) {
        const string sqlCommand = """
                                  DELETE FROM team
                                  WHERE TeamId = @TeamId;
                                  """;
        using var connection = CreateConnection();
        return await connection.ExecuteAsync(sqlCommand, new {teamId}) > 0;
    }

    private TeamWithCharacters MapToTeamWithCharacters(dynamic row) {
        return new TeamWithCharacters
        {
            TeamID = row.TeamID,
            TeamName = row.TeamName,
            UserID = row.UserID,
            FirstCharacter = (row.FirstCharacterID != null)
                ? new TeamCharacterSlot
                {
                    CharacterID = row.FirstCharacterID,
                    BaseCharacterKey = row.FirstCharacterID,
                    Level = row.FirstCharacterLevel
                }
                : null,
            SecondCharacter = (row.SecondCharacterID != null)
                ? new TeamCharacterSlot
                {
                    CharacterID = row.SecondCharacterID,
                    BaseCharacterKey = row.SecondCharacterID,
                    Level = row.SecondCharacterLevel
                }
                : null,
            ThirdCharacter = (row.ThirdCharacterID != null)
                ? new TeamCharacterSlot
                {
                    CharacterID = row.ThirdCharacterID,
                    BaseCharacterKey = row.ThirdCharacterID,
                    Level = row.ThirdCharacterLevel
                }
                : null,
            FourthCharacter = (row.FourthCharacterID != null)
                ? new TeamCharacterSlot
                {
                    CharacterID = row.FourthCharacterID,
                    BaseCharacterKey = row.FourthCharacterID,
                    Level = row.FourthCharacterLevel
                }
                : null
        };
    }
}