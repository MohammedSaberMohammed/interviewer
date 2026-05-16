using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Events;

public record TechnologyPublishedEvent(string TechSlug) : IDomainEvent;
