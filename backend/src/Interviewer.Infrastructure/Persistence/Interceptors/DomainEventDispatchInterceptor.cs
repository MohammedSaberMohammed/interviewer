using Interviewer.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Interviewer.Infrastructure.Persistence.Interceptors;

public class DomainEventDispatchInterceptor(IPublisher publisher) : SaveChangesInterceptor
{
    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken ct = default)
    {
        if (eventData.Context is not null)
            await DispatchDomainEventsAsync(eventData.Context, ct);

        return await base.SavedChangesAsync(eventData, result, ct);
    }

    private async Task DispatchDomainEventsAsync(DbContext context, CancellationToken ct)
    {
        var aggregates = context.ChangeTracker
            .Entries<AggregateRoot<string>>()
            .Where(e => e.Entity.DomainEvents.Count > 0)
            .Select(e => e.Entity)
            .ToList();

        var longIdAggregates = context.ChangeTracker
            .Entries<AggregateRoot<long>>()
            .Where(e => e.Entity.DomainEvents.Count > 0)
            .Select(e => e.Entity)
            .ToList();

        var allEvents = aggregates
            .SelectMany(a => a.DomainEvents)
            .Concat(longIdAggregates.SelectMany(a => a.DomainEvents))
            .ToList();

        aggregates.ForEach(a => a.ClearDomainEvents());
        longIdAggregates.ForEach(a => a.ClearDomainEvents());

        foreach (var domainEvent in allEvents)
            await publisher.Publish(domainEvent, ct);
    }
}
