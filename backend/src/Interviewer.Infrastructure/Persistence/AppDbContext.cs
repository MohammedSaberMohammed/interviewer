using Interviewer.Application.Common.Interfaces;
using Interviewer.Domain.Catalog.Entities;
using Interviewer.Infrastructure.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>(options), IAppDbContext
{
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<Phase> Phases => Set<Phase>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<LessonVersion> LessonVersions => Set<LessonVersion>();
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<ChallengeOption> ChallengeOptions => Set<ChallengeOption>();
    public DbSet<GlossaryEntry> GlossaryEntries => Set<GlossaryEntry>();
    public DbSet<CheatsheetSection> CheatsheetSections => Set<CheatsheetSection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
