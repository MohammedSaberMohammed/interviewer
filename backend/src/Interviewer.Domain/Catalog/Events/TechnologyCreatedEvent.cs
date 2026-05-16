using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Events;

public record TechnologyCreatedEvent(string TechSlug) : IDomainEvent;
