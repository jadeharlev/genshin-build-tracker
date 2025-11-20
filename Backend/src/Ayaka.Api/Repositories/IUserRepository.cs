using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface IUserRepository {
    Task<User?> GetByIDAsync(int userID);
    Task<int> CreateAsync(User user);
    Task<bool> UpdateAsync(User user);
    Task<bool> DeleteAsync(int userID);
}