using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.Entities;

public class ChallengeOption : Entity<long>
{
    public long ChallengeId { get; private set; }
    public int DisplayOrder { get; private set; }
    public string Value { get; private set; } = default!;
    public string Label { get; private set; } = default!;
    public bool IsCorrect { get; private set; }

    private ChallengeOption() { }

    internal ChallengeOption(
        long id,
        long challengeId,
        int displayOrder,
        string value,
        string label,
        bool isCorrect)
    {
        Id = id;
        ChallengeId = challengeId;
        DisplayOrder = displayOrder;
        Value = value;
        Label = label;
        IsCorrect = isCorrect;
    }
}
