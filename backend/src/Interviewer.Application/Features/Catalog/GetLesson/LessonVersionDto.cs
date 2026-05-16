namespace Interviewer.Application.Features.Catalog.GetLesson;

public record ChallengeOptionDto(
    long Id,
    int DisplayOrder,
    string Value,
    string Label,
    bool IsCorrect);

public record ChallengeDto(
    long Id,
    string Key,
    string Type,
    string Title,
    string Question,
    string? Language,
    string? Code,
    string Explanation,
    IReadOnlyList<ChallengeOptionDto> Options);

public record LessonVersionDto(
    long Id,
    int VersionNumber,
    string ContentMdx,
    string? FrontmatterJson,
    string Status,
    DateTime? PublishedAt,
    IReadOnlyList<ChallengeDto> Challenges);
