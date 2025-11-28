namespace Ayaka.Api.Data.Models.GameData;

public interface IImageDownloader {
    Task DownloadCharacterImagesAsync(List<BaseCharacter> characters);
    Task DownloadWeaponImagesAsync(List<BaseWeapon> weapons);
    Task DownloadArtifactImagesAsync(List<BaseArtifactSet> artifactSets);
}