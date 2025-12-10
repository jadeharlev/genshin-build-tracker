using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface IBuildRepository {
    Task<IEnumerable<BuildWithDetails>> GetAllByUserAsync(int userId);
    Task<BuildWithDetails?> GetByIdAsync(int buildId);
    Task<int> CreateAsync(Build build);
    Task<bool> UpdateAsync(Build build);
    Task<bool> DeleteAsync(int buildId, int userId);
}