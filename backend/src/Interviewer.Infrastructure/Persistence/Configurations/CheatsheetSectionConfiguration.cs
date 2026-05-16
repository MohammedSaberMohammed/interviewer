using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class CheatsheetSectionConfiguration : IEntityTypeConfiguration<CheatsheetSection>
{
    public void Configure(EntityTypeBuilder<CheatsheetSection> builder)
    {
        builder.ToTable("CheatsheetSections");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.TechSlug).HasMaxLength(64).IsRequired();
        builder.Property(s => s.SectionId).HasMaxLength(128).IsRequired();
        builder.Property(s => s.Title).HasMaxLength(256).IsRequired();
        builder.Property(s => s.ContentJson).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(s => s.DisplayOrder).IsRequired();

        builder.HasOne<Technology>()
            .WithMany()
            .HasForeignKey(s => s.TechSlug)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => new { s.TechSlug, s.SectionId }).IsUnique();
        builder.HasIndex(s => new { s.TechSlug, s.DisplayOrder });
    }
}
