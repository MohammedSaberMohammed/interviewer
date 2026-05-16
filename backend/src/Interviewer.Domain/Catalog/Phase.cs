using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog;

public enum PhaseLevel { Junior, Mid, Senior }

public class Phase : Entity<long>
{
    public string TechSlug { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public PhaseLevel Level { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsPublished { get; private set; }

    private Phase() { }

    internal Phase(
        long id,
        string techSlug,
        string slug,
        string title,
        string? description,
        PhaseLevel level,
        int displayOrder)
    {
        Id = id;
        TechSlug = techSlug;
        Slug = slug.Trim().ToLowerInvariant();
        Title = title.Trim();
        Description = description?.Trim();
        Level = level;
        DisplayOrder = displayOrder;
        IsPublished = false;
    }

    public void Update(string title, string? description, PhaseLevel level)
    {
        Title = title.Trim();
        Description = description?.Trim();
        Level = level;
    }

    public void SetOrder(int order) => DisplayOrder = order;

    public void Publish() => IsPublished = true;
    public void Unpublish() => IsPublished = false;
}
