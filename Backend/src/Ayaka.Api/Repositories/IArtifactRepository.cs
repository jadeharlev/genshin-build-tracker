using Ayaka.Api.Data.Models;

namespace Ayaka.Api.Repositories;

public interface IArtifactRepository {
    Task<IEnumerable<ArtifactWithStats>> GetAllByUserAsync(int userId);
    Task<ArtifactWithStats?> GetByIdAsync(int artifactId);
    Task<int> CreateAsync(Artifact artifact, ArtifactStat stat1, ArtifactStat? stat2, ArtifactStat? stat3, ArtifactStat? stat4);
    Task<bool> UpdateAsync(Artifact artifact, ArtifactStat stat1, ArtifactStat? stat2, ArtifactStat? stat3,
        ArtifactStat? stat4);
    Task<bool> DeleteAsync(int artifactId);
}