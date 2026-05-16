using Interviewer.Domain.Catalog.Enums;
using Interviewer.Domain.Catalog.Events;
using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Entities;

public class Lesson : AggregateRoot<long>
{
    public long PhaseId { get; private set; }
    public string Slug { get; private set; } = default!;
    public string Title { get; private set; } = default!;
    public string? Summary { get; private set; }
    public LessonDifficulty Difficulty { get; private set; }
    public short ReadingTimeMinutes { get; private set; }
    public int DisplayOrder { get; private set; }
    public long? CurrentVersionId { get; private set; }
    public bool IsPublished { get; private set; }

    private readonly List<LessonVersion> _versions = [];
    public IReadOnlyList<LessonVersion> Versions => _versions.AsReadOnly();

    private Lesson() { }

    public static Lesson Create(
        long phaseId,
        string slug,
        string title,
        string? summary,
        LessonDifficulty difficulty,
        short readingTimeMinutes,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Lesson title cannot be empty.");
        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainException("Lesson slug cannot be empty.");

        return new Lesson
        {
            PhaseId = phaseId,
            Slug = slug.Trim().ToLowerInvariant(),
            Title = title.Trim(),
            Summary = summary?.Trim(),
            Difficulty = difficulty,
            ReadingTimeMinutes = readingTimeMinutes,
            DisplayOrder = displayOrder,
            IsPublished = false
        };
    }

    public LessonVersion CreateDraftVersion(string contentMdx, string? frontmatterJson)
    {
        if (string.IsNullOrWhiteSpace(contentMdx))
            throw new DomainException("Content MDX cannot be empty.");

        var nextVersionNumber = _versions.Count == 0 ? 1 : _versions.Max(v => v.VersionNumber) + 1;
        var version = new LessonVersion(Id, nextVersionNumber, contentMdx, frontmatterJson);
        _versions.Add(version);
        return version;
    }

    public void PublishVersion(int versionNumber, DateTime publishedAt)
    {
        var version = _versions.FirstOrDefault(v => v.VersionNumber == versionNumber)
            ?? throw new DomainException($"Version {versionNumber} not found.");

        version.Publish(publishedAt);
        CurrentVersionId = version.Id;
        IsPublished = true;
        Raise(new LessonPublishedEvent(Id, version.Id));
    }

    public void ArchiveVersion(int versionNumber)
    {
        var version = _versions.FirstOrDefault(v => v.VersionNumber == versionNumber)
            ?? throw new DomainException($"Version {versionNumber} not found.");

        version.Archive();

        if (CurrentVersionId != version.Id)
            return;

        var latestPublished = _versions
            .Where(v => v.Status == LessonVersionStatus.Published && v.Id != version.Id)
            .OrderByDescending(v => v.VersionNumber)
            .FirstOrDefault();

        CurrentVersionId = latestPublished?.Id;
        if (CurrentVersionId is null)
            IsPublished = false;
    }

    public void Update(string title, string? summary, LessonDifficulty difficulty, short readingTimeMinutes)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Lesson title cannot be empty.");

        Title = title.Trim();
        Summary = summary?.Trim();
        Difficulty = difficulty;
        ReadingTimeMinutes = readingTimeMinutes;
    }

    public void Publish() => IsPublished = true;
    public void Unpublish() => IsPublished = false;
    public void SetOrder(int order) => DisplayOrder = order;
}
