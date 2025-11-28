namespace Ayaka.Api.Services.GameData;

public interface IGameDataService {
    // Initialize game data
    Task InitializeAsync();
    
    // If Redis cache has been initialized with game data
    Task<bool> IsInitializedAsync();
    
    // Force refresh game data from API; clear local and Redis data.
    Task RefreshDataAsync();
}