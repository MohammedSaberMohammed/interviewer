using Interviewer.Domain.Common;

namespace Interviewer.Domain.Catalog.ValueObjects;

public sealed class TechSlug : ValueObject
{
    public string Value { get; }

    private TechSlug(string value) => Value = value;

    public static TechSlug Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Tech slug cannot be empty.");

        value = value.Trim().ToLowerInvariant();

        if (value.Length > 64)
            throw new DomainException("Tech slug cannot exceed 64 characters.");

        if (!value.All(c => char.IsLetterOrDigit(c) || c == '-'))
            throw new DomainException("Tech slug may only contain letters, digits, and hyphens.");

        return new TechSlug(value);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(TechSlug slug) => slug.Value;
}
