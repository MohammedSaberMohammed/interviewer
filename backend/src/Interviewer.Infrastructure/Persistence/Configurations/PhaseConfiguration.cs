using Interviewer.Domain.Catalog.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class PhaseConfiguration : IEntityTypeConfiguration<Phase>
{
    public void Configure(EntityTypeBuilder<Phase> builder)
    {
        builder.ToTable("Phases");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).UseIdentityColumn();

        builder.Property(p => p.TechSlug)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(p => p.Slug)
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(p => new { p.TechSlug, p.Slug }).IsUnique();
        builder.HasIndex(p => new { p.TechSlug, p.DisplayOrder });

        builder.Property(p => p.Title)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasMaxLength(1000);

        builder.Property(p => p.Level)
            .HasConversion<string>()
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(p => p.DisplayOrder).IsRequired();

        builder.Property(p => p.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);
    }
}
