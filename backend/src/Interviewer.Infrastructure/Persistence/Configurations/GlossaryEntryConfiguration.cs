using Interviewer.Domain.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Interviewer.Infrastructure.Persistence.Configurations;

public class GlossaryEntryConfiguration : IEntityTypeConfiguration<GlossaryEntry>
{
    public void Configure(EntityTypeBuilder<GlossaryEntry> builder)
    {
        builder.ToTable("GlossaryEntries");

        builder.HasKey(g => g.Id);
        builder.Property(g => g.Id).UseIdentityColumn();

        builder.Property(g => g.TechSlug).HasMaxLength(64).IsRequired();
        builder.Property(g => g.Term).HasMaxLength(256).IsRequired();
        builder.Property(g => g.Definition).HasColumnType("nvarchar(max)").IsRequired();

        builder.HasOne<Technology>()
            .WithMany()
            .HasForeignKey(g => g.TechSlug)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(g => new { g.TechSlug, g.Term }).IsUnique();
    }
}
