using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class ChallengeOptionConfiguration : IEntityTypeConfiguration<ChallengeOption>
{
    public void Configure(EntityTypeBuilder<ChallengeOption> builder)
    {
        builder.ToTable("ChallengeOptions");

        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id)
            .UseIdentityColumn();

        builder.Property(o => o.ChallengeId)
            .IsRequired();

        builder.Property(o => o.DisplayOrder)
            .IsRequired();

        builder.Property(o => o.Value)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(o => o.Label)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(o => o.IsCorrect)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasIndex(o => new { o.ChallengeId, o.DisplayOrder });
    }
}
