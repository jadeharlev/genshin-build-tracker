using System.Data;
using Ayaka.Api.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

public class StatsRepository : IStatsRepository {
    private readonly string connectionString;

    public StatsRepository(IConfiguration configuration) {
        connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<LevelStats> GetLevelStatsAsync() {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_levelstats;
                                  """;
        using var connection = CreateConnection();
        var result = await connection.QuerySingleAsync<LevelStats>(sqlCommand);
        return result;
    }

    public async Task<IEnumerable<RarityStats>> GetRarityStatsAsync() {
        const string sqlCommand = """
                                  SELECT *
                                  FROM v_charactersbyrarity;
                                  """;
        using var connection = CreateConnection();
        var result = await connection.QueryAsync<RarityStats>(sqlCommand);
        return result;
    }
}