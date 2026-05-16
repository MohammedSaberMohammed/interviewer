namespace Interviewer.Application.Features.Catalog.GetLessons;

public record LessonSummaryDto(
    long Id,
    long PhaseId,
    string Slug,
    string Title,
    string? Summary,
    string Difficulty,
    short ReadingTimeMinutes,
    int DisplayOrder,
    bool IsPublished);
