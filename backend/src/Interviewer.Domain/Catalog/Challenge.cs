using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog;

public enum ChallengeType { Mcq, Code, Quiz }

public class Challenge : Entity<long>
{
    public long LessonVersionId { get; private set; }
    public string Key { get; private set; } = default!;
    public ChallengeType Type { get; private set; }
    public string Title { get; private set; } = default!;
    public string Question { get; private set; } = default!;
    public string? Language { get; private set; }
    public string? Code { get; private set; }
    public string Explanation { get; private set; } = default!;

    private readonly List<ChallengeOption> _options = [];
    public IReadOnlyList<ChallengeOption> Options => _options.AsReadOnly();

    private Challenge() { }

    internal Challenge(
        long id,
        long lessonVersionId,
        string key,
        ChallengeType type,
        string title,
        string question,
        string? language,
        string? code,
        string explanation)
    {
        Id = id;
        LessonVersionId = lessonVersionId;
        Key = key;
        Type = type;
        Title = title.Trim();
        Question = question.Trim();
        Language = language;
        Code = code;
        Explanation = explanation.Trim();
    }

    public ChallengeOption AddOption(int displayOrder, string value, string label, bool isCorrect)
    {
        var option = new ChallengeOption(0, Id, displayOrder, value, label, isCorrect);
        _options.Add(option);
        return option;
    }
}
