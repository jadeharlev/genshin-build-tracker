using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;
public class UserRepository : IUserRepository {
    private readonly string connectionString;
    
    public UserRepository(IConfiguration configuration) {
        this.connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<User?> GetByIDAsync(int userID) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM user
                                  WHERE UserID = @userID
                                  """;
        using var connection = CreateConnection();
        var user = await connection.QuerySingleOrDefaultAsync<User>(sqlCommand, new
        {
            userID
        });
        return user;
    }

    public async Task<User?> GetByGoogleIDAsync(string googleID) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM user
                                  WHERE GoogleID = @googleID
                                  """;
        using var connection = CreateConnection();
        var user = await connection.QuerySingleOrDefaultAsync<User>(sqlCommand, new { googleID });
        return user;
    }

    public async Task<int> CreateAsync(User user) {
        const string sqlCommand = """
                                  INSERT INTO user (GoogleID, Email, DisplayName, AdventureRank, AccountName)
                                  VALUES(@GoogleID, @Email, @DisplayName, @AdventureRank, @AccountName);

                                  SELECT LAST_INSERT_ID();
                                  """;
        using var connection = CreateConnection();
    
        try {
            var id = await connection.QuerySingleAsync<int>(sqlCommand, user);
            return id;
        }
        catch (Exception ex) {
            // Log the actual SQL error
            Console.WriteLine($"Database error: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> UpdateAsync(User user) {
        const string sqlCommand = """
                                  UPDATE user
                                  SET AdventureRank = @AdventureRank, 
                                      AccountName = @AccountName
                                  WHERE UserID = @UserID;
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, user);
        return affectedRows > 0;
    }

    public async Task<bool> DeleteAsync(int userID) {
        const string sqlCommand = """
                                  DELETE FROM user
                                  WHERE UserID = @userID;
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, new { userID });
        return affectedRows > 0;
    }
}