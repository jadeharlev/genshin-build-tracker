using Ayaka.Api.Data;
using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface IStatsRepository {
    Task<LevelStats> GetLevelStatsAsync();
    Task<IEnumerable<RarityStats>> GetRarityStatsAsync();
}