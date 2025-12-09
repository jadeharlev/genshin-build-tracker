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
        var result = await connection.QueryAsync<TeamWithCharacters>(sqlCommand, new { userId });

        return result;
    }

    public async Task<TeamWithCharacters?> GetByIdAsync(int teamId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_teamswithcharacters
                                  WHERE TeamId = @teamId;
                                  """;
        
        using var connection = CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<TeamWithCharacters>(sqlCommand, new { teamId });
        return result;
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
}