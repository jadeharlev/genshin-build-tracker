namespace Ayaka.Api.Configuration;

public class GameDataOptions {
    // Where to store local JSON cache files
    public string LocalDataPath { get; set; } = "./GameData/Cache";
    
    // Whether to force data to refresh on startup (ignoring the local cache)
    public bool RefreshDataOnStartup { get; set; } = false;
    
    // Number of days before data is considered stale
    public int CacheExpirationInDays { get; set; } = 60;
    
    // Delay between API requests to avoid rate limits
    public int DelayBetweenAPIRequestsInMs { get; set; } = 500;
}