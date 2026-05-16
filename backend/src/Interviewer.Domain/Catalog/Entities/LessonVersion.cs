using Interviewer.Domain.Catalog.Enums;
using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Entities;

public class LessonVersion : Entity<long>
{
    public long LessonId { get; private set; }
    public int VersionNumber { get; private set; }
    public string ContentMdx { get; private set; } = default!;
    public string? FrontmatterJson { get; private set; }
    public LessonVersionStatus Status { get; private set; }
    public DateTime? PublishedAt { get; private set; }

    private readonly List<Challenge> _challenges = [];
    public IReadOnlyList<Challenge> Challenges => _challenges.AsReadOnly();

    private LessonVersion() { }

    internal LessonVersion(long lessonId, int versionNumber, string contentMdx, string? frontmatterJson)
    {
        LessonId = lessonId;
        VersionNumber = versionNumber;
        ContentMdx = contentMdx;
        FrontmatterJson = frontmatterJson;
        Status = LessonVersionStatus.Draft;
    }

    internal void Publish(DateTime publishedAt)
    {
        Status = LessonVersionStatus.Published;
        PublishedAt = publishedAt;
    }

    internal void Archive() => Status = LessonVersionStatus.Archived;

    public void UpdateContent(string contentMdx, string? frontmatterJson)
    {
        ContentMdx = contentMdx;
        FrontmatterJson = frontmatterJson;
    }

    public Challenge AddChallenge(
        string key,
        ChallengeType type,
        string title,
        string question,
        string? language,
        string? code,
        string explanation)
    {
        if (_challenges.Any(c => c.Key == key))
            throw new DomainException($"Challenge with key '{key}' already exists in this version.");

        var challenge = new Challenge(0, Id, key, type, title, question, language, code, explanation);
        _challenges.Add(challenge);
        return challenge;
    }
}
