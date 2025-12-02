using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface IWeaponRepository {
    Task<IEnumerable<Weapon>> GetAllByUserAsync(int userId);
    Task<Weapon> GetByIdAsync(int weaponId);
    Task<int> CreateAsync(Weapon weapon);
    Task<bool> UpdateAsync(Weapon weapon);
    Task<bool> DeleteAsync(int artifactId);
}