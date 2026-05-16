using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.ToTable("Technologies");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id)
            .HasColumnName("Slug")
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(t => t.Title)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.Property(t => t.IconUrl)
            .HasMaxLength(512);

        builder.Property(t => t.DisplayOrder)
            .IsRequired();

        builder.Property(t => t.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Ignore(t => t.DomainEvents);

        builder.HasMany(t => t.Phases)
            .WithOne()
            .HasForeignKey(p => p.TechSlug)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
