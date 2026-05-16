using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("Lessons");

        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id)
            .UseIdentityColumn();

        builder.Property(l => l.PhaseId)
            .IsRequired();

        builder.Property(l => l.Slug)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(l => l.Title)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(l => l.Summary)
            .HasMaxLength(2000);

        builder.Property(l => l.Difficulty)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(l => l.ReadingTimeMinutes)
            .IsRequired();

        builder.Property(l => l.DisplayOrder)
            .IsRequired();

        builder.Property(l => l.CurrentVersionId);

        builder.Property(l => l.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Ignore(l => l.DomainEvents);

        builder.HasOne<Phase>()
            .WithMany()
            .HasForeignKey(l => l.PhaseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<LessonVersion>()
            .WithMany()
            .HasForeignKey(l => l.CurrentVersionId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasMany(l => l.Versions)
            .WithOne()
            .HasForeignKey(v => v.LessonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(l => new { l.PhaseId, l.Slug })
            .IsUnique();

        builder.HasIndex(l => new { l.PhaseId, l.DisplayOrder });
    }
}
