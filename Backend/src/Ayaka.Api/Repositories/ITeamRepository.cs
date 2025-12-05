using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface ITeamRepository {
    Task<IEnumerable<TeamWithCharacters>> GetAllByUserAsync(int userId);
    Task<TeamWithCharacters?> GetByIdAsync(int teamId);
    Task<int> CreateAsync(Team team);
    Task<bool> UpdateAsync(Team team);
    Task<bool> DeleteAsync(int teamId);
}