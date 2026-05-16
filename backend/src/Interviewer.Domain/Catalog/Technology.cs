using Interviewer.Domain.Catalog.Events;
using Interviewer.Domain.Catalog.ValueObjects;
using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog;

public class Technology : AggregateRoot<string>
{
    private readonly List<Phase> _phases = [];

    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? IconUrl { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsPublished { get; private set; }

    public IReadOnlyList<Phase> Phases => _phases.AsReadOnly();

    private Technology() { }

    public static Technology Create(
        TechSlug slug,
        string title,
        string? description,
        string? iconUrl,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Technology title cannot be empty.");

        var tech = new Technology
        {
            Id = slug.Value,
            Title = title.Trim(),
            Description = description?.Trim(),
            IconUrl = iconUrl?.Trim(),
            DisplayOrder = displayOrder,
            IsPublished = false
        };

        tech.Raise(new TechnologyCreatedEvent(slug.Value));
        return tech;
    }

    public void Update(string title, string? description, string? iconUrl)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Technology title cannot be empty.");

        Title = title.Trim();
        Description = description?.Trim();
        IconUrl = iconUrl?.Trim();
    }

    public void Publish()
    {
        IsPublished = true;
        Raise(new TechnologyPublishedEvent(Id));
    }

    public void Unpublish() => IsPublished = false;

    public void SetOrder(int order) => DisplayOrder = order;

    public Phase AddPhase(string slug, string title, string? description, PhaseLevel level)
    {
        if (_phases.Any(p => p.Slug == slug.Trim().ToLowerInvariant()))
            throw new DomainException($"A phase with slug '{slug}' already exists in this technology.");

        var phase = new Phase(0, Id, slug, title, description, level, _phases.Count + 1);
        _phases.Add(phase);
        return phase;
    }

    public void ReorderPhases(IEnumerable<string> orderedSlugs)
    {
        var slugList = orderedSlugs.ToList();
        for (var i = 0; i < slugList.Count; i++)
        {
            var phase = _phases.FirstOrDefault(p => p.Slug == slugList[i]);
            if (phase is null)
                throw new DomainException($"Phase '{slugList[i]}' not found in technology '{Id}'.");
            phase.SetOrder(i + 1);
        }
    }
}
