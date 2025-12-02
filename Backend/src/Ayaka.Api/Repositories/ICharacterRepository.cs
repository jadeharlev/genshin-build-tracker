using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface ICharacterRepository {
    Task<IEnumerable<Character>> GetAllByUserAsync(int userId);
    Task<Character?> GetByIDAsync(int characterId);
    Task<int> CreateAsync(Character character);
    Task<bool> UpdateAsync(Character character);
    Task<bool> DeleteAsync(int characterId);
}