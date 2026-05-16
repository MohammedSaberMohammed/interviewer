namespace Interviewer.Application.Features.Catalog.GetTechnologies;

public record TechnologyDto(
    string Slug,
    string Title,
    string? Description,
    string? IconUrl,
    int DisplayOrder,
    bool IsPublished);
