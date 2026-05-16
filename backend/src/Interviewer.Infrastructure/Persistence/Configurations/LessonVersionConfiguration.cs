using Interviewer.Domain.Catalog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class LessonVersionConfiguration : IEntityTypeConfiguration<LessonVersion>
{
    public void Configure(EntityTypeBuilder<LessonVersion> builder)
    {
        builder.ToTable("LessonVersions");

        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id)
            .UseIdentityColumn();

        builder.Property(v => v.LessonId)
            .IsRequired();

        builder.Property(v => v.VersionNumber)
            .IsRequired();

        builder.Property(v => v.ContentMdx)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(v => v.FrontmatterJson)
            .HasColumnType("nvarchar(max)");

        builder.Property(v => v.Status)
            .HasConversion<string>()
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(v => v.PublishedAt);

        builder.HasMany(v => v.Challenges)
            .WithOne()
            .HasForeignKey(c => c.LessonVersionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(v => new { v.LessonId, v.VersionNumber })
            .IsUnique();

        builder.HasIndex(v => new { v.LessonId, v.Status });
    }
}
