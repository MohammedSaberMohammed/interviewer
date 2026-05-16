namespace Interviewer.Application.Features.Catalog.GetLesson;

public record LessonDetailDto(
    long Id,
    long PhaseId,
    string Slug,
    string Title,
    string? Summary,
    string Difficulty,
    short ReadingTimeMinutes,
    int DisplayOrder,
    long? CurrentVersionId,
    bool IsPublished,
    LessonVersionDto? CurrentVersion);
