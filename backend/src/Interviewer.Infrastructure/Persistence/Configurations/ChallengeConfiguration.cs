using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.ToTable("Challenges");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .UseIdentityColumn();

        builder.Property(c => c.LessonVersionId)
            .IsRequired();

        builder.Property(c => c.Key)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(c => c.Type)
            .HasConversion<string>()
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(c => c.Title)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(c => c.Question)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(c => c.Language)
            .HasMaxLength(32);

        builder.Property(c => c.Code)
            .HasColumnType("nvarchar(max)");

        builder.Property(c => c.Explanation)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.HasMany(c => c.Options)
            .WithOne()
            .HasForeignKey(o => o.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => new { c.LessonVersionId, c.Key })
            .IsUnique();
    }
}
