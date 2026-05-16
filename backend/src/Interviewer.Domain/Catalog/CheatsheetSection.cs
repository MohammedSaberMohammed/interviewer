using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog;

public class CheatsheetSection : Entity<long>
{
    public string TechSlug { get; private set; } = default!;
    public string SectionId { get; private set; } = default!;
    public string Title { get; private set; } = default!;
    public string ContentJson { get; private set; } = default!;
    public int DisplayOrder { get; private set; }

    private CheatsheetSection() { }

    public static CheatsheetSection Create(
        string techSlug, string sectionId, string title, string contentJson, int displayOrder) =>
        new()
        {
            TechSlug = techSlug,
            SectionId = sectionId,
            Title = title.Trim(),
            ContentJson = contentJson,
            DisplayOrder = displayOrder
        };

    public void Update(string title, string contentJson, int displayOrder)
    {
        Title = title.Trim();
        ContentJson = contentJson;
        DisplayOrder = displayOrder;
    }
}
