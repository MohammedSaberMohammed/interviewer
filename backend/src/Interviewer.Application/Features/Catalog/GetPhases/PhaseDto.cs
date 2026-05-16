namespace Interviewer.Application.Features.Catalog.GetPhases;

public record PhaseDto(
    long Id,
    string TechSlug,
    string Slug,
    string Title,
    string? Description,
    string Level,
    int DisplayOrder,
    bool IsPublished);
