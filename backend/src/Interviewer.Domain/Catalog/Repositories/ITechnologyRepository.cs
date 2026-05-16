using Interviewer.Domain.Catalog.Entities;

namespace Interviewer.Domain.Catalog.Repositories;

public interface ITechnologyRepository
{
    Task<Technology?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<List<Technology>> GetAllAsync(CancellationToken ct = default);
    Task<bool> ExistsAsync(string slug, CancellationToken ct = default);
    void Add(Technology technology);
    void Update(Technology technology);
}
