using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog;

public class GlossaryEntry : Entity<long>
{
    public string TechSlug { get; private set; } = default!;
    public string Term { get; private set; } = default!;
    public string Definition { get; private set; } = default!;

    private GlossaryEntry() { }

    public static GlossaryEntry Create(string techSlug, string term, string definition) =>
        new() { TechSlug = techSlug, Term = term.Trim(), Definition = definition.Trim() };

    public void Update(string definition) => Definition = definition.Trim();
}
