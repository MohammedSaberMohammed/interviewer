using Interviewer.Domain.Catalog.Entities;

namespace Interviewer.Domain.Catalog.Repositories;

public interface ILessonRepository
{
    Task<Lesson?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Lesson?> GetBySlugAsync(long phaseId, string slug, CancellationToken ct = default);
    Task<List<Lesson>> GetByPhaseAsync(long phaseId, bool publishedOnly, CancellationToken ct = default);
    void Add(Lesson lesson);
    void Update(Lesson lesson);
}
