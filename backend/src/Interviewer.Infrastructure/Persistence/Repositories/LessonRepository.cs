using Interviewer.Domain.Catalog;
using Interviewer.Domain.Catalog.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Infrastructure.Persistence.Repositories;

public class LessonRepository(AppDbContext context) : ILessonRepository
{
    public async Task<Lesson?> GetByIdAsync(long id, CancellationToken ct = default) =>
        await context.Lessons
            .Include(l => l.Versions)
                .ThenInclude(v => v.Challenges)
                    .ThenInclude(c => c.Options)
            .FirstOrDefaultAsync(l => l.Id == id, ct);

    public async Task<Lesson?> GetBySlugAsync(long phaseId, string slug, CancellationToken ct = default) =>
        await context.Lessons
            .Include(l => l.Versions)
                .ThenInclude(v => v.Challenges)
                    .ThenInclude(c => c.Options)
            .FirstOrDefaultAsync(l => l.PhaseId == phaseId && l.Slug == slug, ct);

    public async Task<List<Lesson>> GetByPhaseAsync(long phaseId, bool publishedOnly, CancellationToken ct = default)
    {
        var query = context.Lessons.Where(l => l.PhaseId == phaseId);
        if (publishedOnly)
            query = query.Where(l => l.IsPublished);
        return await query.OrderBy(l => l.DisplayOrder).ToListAsync(ct);
    }

    public void Add(Lesson lesson) => context.Lessons.Add(lesson);

    public void Update(Lesson lesson) => context.Lessons.Update(lesson);
}
