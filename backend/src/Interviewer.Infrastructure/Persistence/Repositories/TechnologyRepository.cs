using Interviewer.Domain.Catalog.Entities;
using Interviewer.Domain.Catalog.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Infrastructure.Persistence.Repositories;

public class TechnologyRepository(AppDbContext db) : ITechnologyRepository
{
    public Task<Technology?> GetBySlugAsync(string slug, CancellationToken ct) =>
        db.Technologies
            .Include(t => t.Phases)
            .FirstOrDefaultAsync(t => t.Id == slug, ct);

    public Task<List<Technology>> GetAllAsync(CancellationToken ct) =>
        db.Technologies
            .Include(t => t.Phases)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(ct);

    public Task<bool> ExistsAsync(string slug, CancellationToken ct) =>
        db.Technologies.AnyAsync(t => t.Id == slug, ct);

    public void Add(Technology technology) => db.Technologies.Add(technology);

    public void Update(Technology technology) => db.Technologies.Update(technology);
}
