using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Events;

public record LessonPublishedEvent(long LessonId, long VersionId) : IDomainEvent;
