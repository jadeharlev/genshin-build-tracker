using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

public class WeaponRepository : IWeaponRepository {
    private readonly string connectionString;

    public WeaponRepository(IConfiguration configuration) {
        connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<IEnumerable<Weapon>> GetAllByUserAsync(int userId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM weapon
                                  WHERE UserID = @userId;
                                  """;
        using var connection = CreateConnection();
        return await connection.QueryAsync<Weapon>(sqlCommand, new { userId });
    }

    public async Task<Weapon> GetByIdAsync(int weaponId) {
        const string sqlCommand = """
                                  SELECT *
                                  FROM weapon
                                  WHERE WeaponID = @weaponId;
                                  """;
        using var connection = CreateConnection();
        var weapon = await connection.QuerySingleOrDefaultAsync<Weapon>(sqlCommand, new { weaponId });
        return weapon;
    }

    public async Task<int> CreateAsync(Weapon weapon) {
        const string sqlCommand = """
                                  INSERT INTO weapon(BaseWeaponKey, Level, Ascension, Refinement, UserID) 
                                  VALUES (@BaseWeaponKey, @Level, @Ascension, @Refinement, @UserID);

                                  SELECT LAST_INSERT_ID();
                                  """;
        using var connection = CreateConnection();
        var newID = await connection.QuerySingleAsync<int>(sqlCommand, weapon);
        return newID;
    }

    public async Task<bool> UpdateAsync(Weapon weapon) {
        const string sqlCommand = """
                                  UPDATE weapon
                                  SET BaseWeaponKey = @BaseWeaponKey,
                                      Level = @Level,
                                      Ascension = @Ascension,
                                      Refinement = @Refinement,
                                      @UserID = @UserID
                                  WHERE UserID = @UserID AND WeaponID = @WeaponID;
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, weapon);
        return affectedRows > 0;

    }

    public async Task<bool> DeleteAsync(int weaponId) {
        const string sqlCommand = """
                                  DELETE FROM weapon
                                  WHERE WeaponID = @weaponId
                                  """;
        using var connection = CreateConnection();
        var affectedRows = await connection.ExecuteAsync(sqlCommand, new { weaponId });
        return affectedRows > 0;
    }
}