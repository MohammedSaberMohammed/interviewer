using Interviewer.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Interviewer.Infrastructure.Persistence.Interceptors;

public class AuditInterceptor(IDateTimeProvider clock) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken ct = default)
    {
        if (eventData.Context is null) return base.SavingChangesAsync(eventData, result, ct);

        var now = clock.UtcNow;

        foreach (var entry in eventData.Context.ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                TrySetProperty(entry.Entity, "CreatedAt", now);
                TrySetProperty(entry.Entity, "UpdatedAt", now);
            }
            else if (entry.State == EntityState.Modified)
            {
                TrySetProperty(entry.Entity, "UpdatedAt", now);
            }
        }

        return base.SavingChangesAsync(eventData, result, ct);
    }

    private static void TrySetProperty(object entity, string propertyName, object value)
    {
        var prop = entity.GetType().GetProperty(propertyName);
        if (prop is not null && prop.CanWrite)
            prop.SetValue(entity, value);
    }
}
