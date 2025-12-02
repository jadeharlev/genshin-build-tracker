using System.Data;
using Ayaka.Api.Data.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Ayaka.Api.Repositories;

public class ArtifactRepository : IArtifactRepository {
    private readonly string connectionString;
    
    public ArtifactRepository(IConfiguration configuration) {
        this.connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    private IDbConnection CreateConnection() {
        return new MySqlConnection(connectionString);
    }
    
    public async Task<IEnumerable<ArtifactWithStats>> GetAllByUserAsync(int userId) {
        const string sqlCommand = """
                                  SELECT a.ArtifactId, a.ArtifactType, a.Rarity, a.SetKey, a.Level, a.MainStatType,
                                         as1.ArtifactStatID, as1.StatType, as1.Value,
                                         as2.ArtifactStatID, as2.StatType, as2.Value,
                                         as3.ArtifactStatID, as3.StatType, as3.Value,
                                         as4.ArtifactStatID, as4.StatType, as4.Value
                                  FROM artifact as a
                                  INNER JOIN artifactstat as as1 ON a.FirstArtifactStatID = as1.ArtifactStatID
                                  LEFT JOIN artifactstat as as2 ON a.SecondArtifactStatID = as2.ArtifactStatID
                                  LEFT JOIN artifactstat as as3 ON a.ThirdArtifactStatID = as3.ArtifactStatID
                                  LEFT JOIN artifactstat as as4 ON a.FourthArtifactStatID = as4.ArtifactStatID
                                  WHERE a.UserID = @userId;
                                  """;
        
        using var connection = CreateConnection();

        var artifacts = await connection
            .QueryAsync<ArtifactWithStats, ArtifactStat, ArtifactStat, ArtifactStat, ArtifactStat, ArtifactWithStats>(
                sqlCommand, (artifact, stat1, stat2, stat3, stat4) =>
                {
                    artifact.FirstStat = stat1;
                    artifact.SecondStat = stat2;
                    artifact.ThirdStat = stat3;
                    artifact.FourthStat = stat4;
                    return artifact;
                },
                new { userId },
                splitOn: "ArtifactStatID,ArtifactStatID,ArtifactStatID,ArtifactStatID"
            );
        return artifacts;
    }

    public async Task<ArtifactWithStats?> GetByIdAsync(int artifactId) {
        const string sqlCommand = """
                                  SELECT a.ArtifactId, a.ArtifactType, a.Rarity, a.SetKey, a.Level, a.MainStatType,
                                         as1.ArtifactStatID, as1.StatType, as1.Value,
                                         as2.ArtifactStatID, as2.StatType, as2.Value,
                                         as3.ArtifactStatID, as3.StatType, as3.Value,
                                         as4.ArtifactStatID, as4.StatType, as4.Value
                                  FROM artifact as a
                                  INNER JOIN artifactstat as as1 ON a.FirstArtifactStatID = as1.ArtifactStatID
                                  LEFT JOIN artifactstat as as2 ON a.SecondArtifactStatID = as2.ArtifactStatID
                                  LEFT JOIN artifactstat as as3 ON a.ThirdArtifactStatID = as3.ArtifactStatID
                                  LEFT JOIN artifactstat as as4 ON a.FourthArtifactStatID = as4.ArtifactStatID
                                  WHERE a.ArtifactID = @artifactId;
                                  """;
        
        using var connection = CreateConnection();
        
        var artifacts = await connection
            .QueryAsync<ArtifactWithStats, ArtifactStat, ArtifactStat, ArtifactStat, ArtifactStat, ArtifactWithStats>(
                sqlCommand, (artifact, stat1, stat2, stat3, stat4) =>
                {
                    artifact.FirstStat = stat1;
                    artifact.SecondStat = stat2;
                    artifact.ThirdStat = stat3;
                    artifact.FourthStat = stat4;
                    return artifact;
                },
                new { artifactId },
                splitOn: "ArtifactStatID,ArtifactStatID,ArtifactStatID,ArtifactStatID"
            );
        return artifacts.FirstOrDefault();
    }

    public async Task<int> CreateAsync(Artifact artifact, ArtifactStat stat1, ArtifactStat? stat2, ArtifactStat? stat3, ArtifactStat? stat4) {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try {
            const string insertStatSqlCommand = """
                                                INSERT INTO artifactstat(StatType, Value)
                                                VALUES (@StatType, @Value);
                                                SELECT LAST_INSERT_ID();
                                                """;

            var stat1Id = await connection.QuerySingleAsync<int>(insertStatSqlCommand, stat1, transaction);
            artifact.FirstArtifactStatID = stat1Id;
            
            if (stat2 != null) {
                var stat2Id = await connection.QuerySingleAsync<int>(insertStatSqlCommand, stat2, transaction);
                artifact.SecondArtifactStatID = stat2Id;
            }

            if (stat3 != null) {
                var stat3Id = await connection.QuerySingleAsync<int>(insertStatSqlCommand, stat3, transaction);
                artifact.ThirdArtifactStatID = stat3Id;
            }

            if (stat4 != null) {
                var stat4Id = await connection.QuerySingleAsync<int>(insertStatSqlCommand, stat4, transaction);
                artifact.FourthArtifactStatID = stat4Id;
            }
            

            const string insertArtifactSqlCommand = """
                                                    INSERT INTO artifact (ArtifactType, Rarity, SetKey, Level, MainStatType, FirstArtifactStatID, SecondArtifactStatID, ThirdArtifactStatID, FourthArtifactStatID, UserID) 
                                                    VALUES (@ArtifactType, @Rarity, @SetKey, @Level, @MainStatType, @FirstArtifactStatID, @SecondArtifactStatID, @ThirdArtifactStatID, @FourthArtifactStatID, @UserID);
                                                    SELECT LAST_INSERT_ID();
                                                    """;

            var artifactId = await connection.QuerySingleAsync<int>(insertArtifactSqlCommand, artifact, transaction);

            transaction.Commit();
            return artifactId;
        }
        catch {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> UpdateAsync(Artifact artifact, ArtifactStat stat1, ArtifactStat? stat2, ArtifactStat? stat3,
        ArtifactStat? stat4) {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try {
            const string updateArtifactSqlCommand = """
                                                    UPDATE artifact
                                                    SET ArtifactType = @ArtifactType,
                                                        Rarity = @Rarity,
                                                        Level = @Level,
                                                        MainStatType = @MainStatType
                                                    WHERE ArtifactID = @ArtifactId AND UserID = @UserID 
                                                    """;

            var artifactRows = await connection.ExecuteAsync(updateArtifactSqlCommand, artifact, transaction);
            if (artifactRows == 0) {
                transaction.Rollback();
                return false;
            }

            const string updateStatSqlCommand = """
                                                UPDATE artifactstat
                                                SET StatType = @StatType, Value = @Value
                                                WHERE ArtifactStatID = @ArtifactStatId
                                                """;
            stat1.ArtifactStatID = artifact.FirstArtifactStatID;
            await connection.ExecuteAsync(updateStatSqlCommand, stat1, transaction);
            
            if(stat2 != null && artifact.SecondArtifactStatID.HasValue) {
                stat2.ArtifactStatID = artifact.SecondArtifactStatID.Value;
                await connection.ExecuteAsync(updateStatSqlCommand, stat2, transaction);
            }

            if (stat3 != null && artifact.ThirdArtifactStatID.HasValue) {
                stat3.ArtifactStatID = artifact.ThirdArtifactStatID.Value;
                await connection.ExecuteAsync(updateStatSqlCommand, stat3, transaction);
            }

            if (stat4 != null && artifact.FourthArtifactStatID.HasValue) {
                stat4.ArtifactStatID = artifact.FourthArtifactStatID.Value;
                await connection.ExecuteAsync(updateStatSqlCommand, stat4, transaction);
            }

            transaction.Commit();
            return true;
        }
        catch {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int artifactId) {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try {
            const string getStatIdsSqlCommand = """
                                                SELECT FirstArtifactStatID, SecondArtifactStatID, ThirdArtifactStatID, FourthArtifactStatID
                                                FROM artifact
                                                WHERE ArtifactID = @artifactId;
                                                """;
            var artifact = await connection.QuerySingleOrDefaultAsync<Artifact>(getStatIdsSqlCommand,
                new { artifactId },
                transaction);
            if (artifact == null) return false;
            const string deleteArtifactSqlCommand = """
                                                    DELETE FROM artifact
                                                    WHERE ArtifactID = @artifactId;
                                                    """;
            await connection.ExecuteAsync(deleteArtifactSqlCommand, new { artifactId }, transaction);

            const string deleteStatSqlCommand = """
                                                DELETE FROM artifactstat
                                                WHERE ArtifactStatID = @statId;
                                                """;
            await connection.ExecuteAsync(deleteStatSqlCommand, new { statId = artifact.FirstArtifactStatID },
                transaction);
            if (artifact.SecondArtifactStatID.HasValue) {
                await connection.ExecuteAsync(deleteStatSqlCommand, new { statId = artifact.SecondArtifactStatID },
                    transaction);
            }

            if (artifact.ThirdArtifactStatID.HasValue) {
                await connection.ExecuteAsync(deleteStatSqlCommand, new { statId = artifact.ThirdArtifactStatID },
                    transaction);
            }

            if (artifact.FourthArtifactStatID.HasValue) {
                await connection.ExecuteAsync(deleteStatSqlCommand, new { statId = artifact.FourthArtifactStatID },
                    transaction);
            }

            transaction.Commit();
            return true;
        }
        catch {
            transaction.Rollback();
            throw;
        }
    }
}