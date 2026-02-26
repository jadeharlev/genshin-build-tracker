namespace Ayaka.Api.Data.Models.GameData; 

public class ImageDownloader : IImageDownloader {
    private readonly HttpClient httpClient;
    private readonly ILogger<ImageDownloader> logger;
    private readonly string imageBasePath;
    private const int DelayBetweenImageDownloadsInMs = 100;

    public ImageDownloader(HttpClient httpClient, ILogger<ImageDownloader> logger,
        IWebHostEnvironment webHostEnvironment) {
        this.httpClient = httpClient;
        this.logger = logger;
        var webRoot = webHostEnvironment.WebRootPath; 
        this.imageBasePath = Path.Combine(webRoot, "images");
    }
    
    public async Task DownloadCharacterImagesAsync(List<BaseCharacter> characters) {
        var characterPath = Path.Combine(this.imageBasePath, "characters");
        Directory.CreateDirectory(characterPath);
        foreach (var character in characters) {
            try {
                var url = $"https://genshin.jmp.blue/characters/{character.Key}/icon";
                var imagePath = Path.Combine(characterPath, $"{character.Key}.png");

                if (File.Exists(imagePath)) {
                    logger.LogDebug($"Skipped {character.Name}; image already existed.");
                    continue;
                }
                
                var imageBytes = await httpClient.GetByteArrayAsync(url);
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                character.Icon = $"{character.Key}.png";
                logger.LogInformation($"Downloaded image for {character.Name}");
                
                await Task.Delay(DelayBetweenImageDownloadsInMs);
            } catch (HttpRequestException e) {
                logger.LogWarning($"Failed to download image for {character.Name}; {e.Message}");
                character.Icon = null;
            } catch (Exception e) {
                logger.LogError($"Failed to download image for {character.Name}; {e.Message}");
                character.Icon = null;
            }
        }
    }

    public async Task DownloadWeaponImagesAsync(List<BaseWeapon> weapons) {
        var weaponPath = Path.Combine(this.imageBasePath, "weapons");
        Directory.CreateDirectory(weaponPath);
        foreach (var weapon in weapons) {
            try {
                var url = $"https://genshin.jmp.blue/weapons/{weapon.Key}/icon";
                var imagePath = Path.Combine(weaponPath, $"{weapon.Key}.png");

                if (File.Exists(imagePath)) {
                    logger.LogDebug($"Skipped {weapon.Name}; image already existed.");
                    continue;
                }
                
                var imageBytes = await httpClient.GetByteArrayAsync(url);
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                weapon.Icon = $"{weapon.Key}.png";
                logger.LogInformation($"Downloaded image for {weapon.Name}");
                
                await Task.Delay(DelayBetweenImageDownloadsInMs);
            } catch (HttpRequestException e) {
                logger.LogWarning($"Failed to download image for {weapon.Name}; {e.Message}");
                weapon.Icon = null;
            } catch (Exception e) {
                logger.LogError($"Failed to download image for {weapon.Name}; {e.Message}");
                weapon.Icon = null;
            }
        }
    }

    public async Task DownloadArtifactImagesAsync(List<BaseArtifactSet> artifactSets) {
        var artifactPath = Path.Combine(this.imageBasePath, "artifacts");
        Directory.CreateDirectory(artifactPath);
        
        var artifactSlots = new[] { "flower-of-life", "plume-of-death", "sands-of-eon", "goblet-of-eonothem", "circlet-of-logos" };
        foreach (var artifactSet in artifactSets) {
            foreach (var slot in artifactSlots) {
                try {
                    var url = $"https://genshin.jmp.blue/artifacts/{artifactSet.Key}/{slot}.png";
                    var imagePath = Path.Combine(artifactPath, $"{artifactSet.Key}_{slot}.png");
                    if (File.Exists(imagePath)) {
                        continue;
                    }

                    var imageBytes = await httpClient.GetByteArrayAsync(url);
                    await File.WriteAllBytesAsync(imagePath, imageBytes);

                    switch (slot) {
                        case "flower-of-life":
                            artifactSet.FlowerIcon = $"{artifactSet.Key}_{slot}.png";
                            break;
                        case "plume-of-death":
                            artifactSet.FeatherIcon = $"{artifactSet.Key}_{slot}.png";
                            break;
                        case "sands-of-eon":
                            artifactSet.SandsIcon = $"{artifactSet.Key}_{slot}.png";
                            break;
                        case "goblet-of-eonothem":
                            artifactSet.GobletIcon = $"{artifactSet.Key}_{slot}.png";
                            break;
                        case "circlet-of-logos":
                            artifactSet.CircletIcon = $"{artifactSet.Key}_{slot}.png";
                            break;
                        default:
                            logger.LogError("Invalid case in DownloadArtifactImagesAsync.");
                            break;
                    }

                    logger.LogInformation($"Downloaded {slot} image for {artifactSet.Name}");
                    await Task.Delay(DelayBetweenImageDownloadsInMs);
                }
                catch (Exception e) {
                    logger.LogWarning("Failed to download {slot} image for {set.Name}.");
                }
            }
        }
    }
}