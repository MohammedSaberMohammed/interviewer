using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Technology> Technologies { get; }
    DbSet<Phase> Phases { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<LessonVersion> LessonVersions { get; }
    DbSet<Challenge> Challenges { get; }
    DbSet<ChallengeOption> ChallengeOptions { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
