using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Technology> Technologies { get; }
    DbSet<Phase> Phases { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
