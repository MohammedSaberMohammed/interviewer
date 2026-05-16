using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Interviewer.Domain.Catalog;
using Interviewer.Domain.Catalog.ValueObjects;
using Interviewer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

const string DefaultConnStr =
    "Server=.\\SQLEXPRESS;Database=interviewer_app_db;Trusted_Connection=True;" +
    "MultipleActiveResultSets=true;Encrypt=false";

var connStr = args.Length > 0 ? args[0] : DefaultConnStr;
var contentRoot = args.Length > 1 ? args[1] : FindContentRoot();

Console.WriteLine($"Content root : {contentRoot}");
Console.WriteLine($"Connection   : {MaskPassword(connStr)}");
Console.WriteLine();

var dbOptions = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlServer(connStr)
    .Options;

var techDirs = Directory.GetDirectories(contentRoot).OrderBy(d => d);
int totalLessons = 0, totalChallenges = 0, totalErrors = 0;

foreach (var techDir in techDirs)
{
    var techJsonPath = Path.Combine(techDir, "_tech.json");
    if (!File.Exists(techJsonPath)) continue;

    var techModel = Deserialize<TechModel>(techJsonPath);

    Console.WriteLine($"▶  {techModel.Slug}  —  {techModel.Title}");

    await UpsertTechnology(dbOptions, techModel);
    await ImportCheatsheet(dbOptions, techModel.Slug, Path.Combine(techDir, "cheatsheet.json"));
    await ImportGlossary(dbOptions, techModel.Slug, Path.Combine(techDir, "glossary.json"));

    var phasesDir = Path.Combine(techDir, "phases");
    if (!Directory.Exists(phasesDir)) continue;

    foreach (var phaseDir in Directory.GetDirectories(phasesDir).OrderBy(d => d))
    {
        var metaPath = Path.Combine(phaseDir, "_meta.json");
        if (!File.Exists(metaPath)) continue;

        var meta = Deserialize<PhaseMetaModel>(metaPath);
        var phaseId = await UpsertPhase(dbOptions, techModel.Slug, meta);

        foreach (var mdxPath in Directory.GetFiles(phaseDir, "*.mdx").OrderBy(f => f))
        {
            try
            {
                var (l, c) = await ImportLesson(dbOptions, phaseId, mdxPath);
                totalLessons += l;
                totalChallenges += c;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"      ERROR {Path.GetFileName(mdxPath)}: {ex.Message}");
                totalErrors++;
            }
        }
    }

    Console.WriteLine();
}

Console.WriteLine($"Done.  Lessons: {totalLessons}  Challenges: {totalChallenges}  Errors: {totalErrors}");
return totalErrors == 0 ? 0 : 1;

// ── Technology ────────────────────────────────────────────────────────────────

static async Task UpsertTechnology(DbContextOptions<AppDbContext> opts, TechModel m)
{
    await using var ctx = new AppDbContext(opts);

    var tech = await ctx.Technologies.FindAsync(m.Slug);
    if (tech is null)
    {
        tech = Technology.Create(TechSlug.Create(m.Slug), m.Title, m.Description, m.Icon, m.Order);
        tech.Publish();
        ctx.Technologies.Add(tech);
    }
    else
    {
        tech.Update(m.Title, m.Description, m.Icon);
        tech.SetOrder(m.Order);
        if (!tech.IsPublished) tech.Publish();
    }

    await ctx.SaveChangesAsync();
    Console.WriteLine($"    ~ tech {m.Slug}");
}

// ── Phase ─────────────────────────────────────────────────────────────────────

static async Task<long> UpsertPhase(
    DbContextOptions<AppDbContext> opts, string techSlug, PhaseMetaModel meta)
{
    await using var ctx = new AppDbContext(opts);

    var existing = await ctx.Phases
        .FirstOrDefaultAsync(p => p.TechSlug == techSlug && p.Slug == meta.Slug);

    if (existing is null)
    {
        var tech = await ctx.Technologies.FindAsync(techSlug);
        var phase = tech!.AddPhase(meta.Slug, meta.Title, meta.Description, MapLevel(meta.Level));
        phase.SetOrder(meta.Number);
        phase.Publish();
        await ctx.SaveChangesAsync();
        Console.WriteLine($"    + phase {meta.Slug}");
        return phase.Id;
    }

    existing.Update(meta.Title, meta.Description, MapLevel(meta.Level));
    existing.SetOrder(meta.Number);
    if (!existing.IsPublished) existing.Publish();
    await ctx.SaveChangesAsync();
    return existing.Id;
}

// ── Lesson + version + challenges ─────────────────────────────────────────────

static async Task<(int lessons, int challenges)> ImportLesson(
    DbContextOptions<AppDbContext> opts, long phaseId, string mdxPath)
{
    var raw = await File.ReadAllTextAsync(mdxPath);
    var (fmYaml, bodyMdx) = SplitFrontmatter(raw);
    if (string.IsNullOrWhiteSpace(fmYaml)) return (0, 0);

    var fm = ParseFrontmatter(fmYaml);
    if (fm.Status != "published") return (0, 0);

    var quizzes = ExtractQuizzes(bodyMdx).ToList();
    var fmJson = JsonSerializer.Serialize(
        new { fm.QuestMode, fm.Tags, fm.DocsLinks }, Config.JsonOpts);

    await using var ctx = new AppDbContext(opts);

    // ── lesson ──────────────────────────────────────────────────────────────
    var difficulty = MapDifficulty(fm.Difficulty);
    var readingTime = (short)fm.ReadingTime;

    var lesson = await ctx.Lessons
        .FirstOrDefaultAsync(l => l.PhaseId == phaseId && l.Slug == fm.Slug);

    bool isNewLesson = lesson is null;
    if (isNewLesson)
    {
        lesson = Lesson.Create(phaseId, fm.Slug, fm.Title, fm.Summary, difficulty, readingTime, fm.Order);
        ctx.Lessons.Add(lesson);
        await ctx.SaveChangesAsync();
    }
    else
    {
        lesson!.Update(fm.Title, fm.Summary, difficulty, readingTime);
        lesson.SetOrder(fm.Order);
        await ctx.SaveChangesAsync();
    }

    // ── version ─────────────────────────────────────────────────────────────
    LessonVersion version;

    if (isNewLesson)
    {
        // lesson._versions is empty — CreateDraftVersion gives version number 1
        version = lesson.CreateDraftVersion(bodyMdx, fmJson);
        await ctx.SaveChangesAsync();           // version.Id assigned by identity column

        lesson.PublishVersion(1, DateTime.UtcNow);
        await ctx.SaveChangesAsync();           // lesson.CurrentVersionId updated
    }
    else
    {
        // Load without Include so _challenges stays empty for AddChallenge later
        var existing = await ctx.LessonVersions
            .FirstOrDefaultAsync(v => v.LessonId == lesson.Id && v.VersionNumber == 1);

        if (existing is null)
        {
            // Unusual: lesson exists but has no version yet
            version = lesson.CreateDraftVersion(bodyMdx, fmJson);
            await ctx.SaveChangesAsync();
            lesson.PublishVersion(1, DateTime.UtcNow);
            await ctx.SaveChangesAsync();
        }
        else
        {
            existing.UpdateContent(bodyMdx, fmJson);

            // Wipe old challenges with raw SQL — cascade handles options
            await ctx.Database.ExecuteSqlRawAsync(
                "DELETE FROM ChallengeOptions WHERE ChallengeId IN " +
                "(SELECT Id FROM Challenges WHERE LessonVersionId = {0})",
                existing.Id);
            await ctx.Database.ExecuteSqlRawAsync(
                "DELETE FROM Challenges WHERE LessonVersionId = {0}",
                existing.Id);

            await ctx.SaveChangesAsync();       // flush content update

            version = existing;
            // _challenges backing field is still empty (never included) — AddChallenge works
        }
    }

    // ── challenges ──────────────────────────────────────────────────────────
    foreach (var quiz in quizzes)
    {
        var title = quiz.Question.Length <= 256
            ? quiz.Question
            : quiz.Question[..253] + "...";

        var challenge = version.AddChallenge(
            quiz.Id, ChallengeType.Quiz, title, quiz.Question, null, null, quiz.Explanation);

        for (var i = 0; i < quiz.Options.Length; i++)
            challenge.AddOption(i, i.ToString(), quiz.Options[i], i == quiz.CorrectAnswer);
    }

    await ctx.SaveChangesAsync();

    var marker = isNewLesson ? "+" : "~";
    Console.WriteLine($"      {marker} {fm.Slug} ({quizzes.Count} Q)");
    return (1, quizzes.Count);
}

// ── Cheatsheet ────────────────────────────────────────────────────────────────

static async Task ImportCheatsheet(
    DbContextOptions<AppDbContext> opts, string techSlug, string jsonPath)
{
    if (!File.Exists(jsonPath)) return;

    var doc = Deserialize<CheatsheetDocModel>(jsonPath);
    if (doc.Sections is null || doc.Sections.Count == 0) return;

    await using var ctx = new AppDbContext(opts);
    var existing = await ctx.CheatsheetSections
        .Where(s => s.TechSlug == techSlug)
        .ToDictionaryAsync(s => s.SectionId);

    for (var i = 0; i < doc.Sections.Count; i++)
    {
        var sec = doc.Sections[i];
        var contentJson = JsonSerializer.Serialize(sec.Content, Config.JsonOpts);

        if (existing.TryGetValue(sec.Id, out var dbSec))
            dbSec.Update(sec.Title, contentJson, i + 1);
        else
            ctx.CheatsheetSections.Add(
                CheatsheetSection.Create(techSlug, sec.Id, sec.Title, contentJson, i + 1));
    }

    await ctx.SaveChangesAsync();
    Console.WriteLine($"    ~ cheatsheet ({doc.Sections.Count} sections)");
}

// ── Glossary ──────────────────────────────────────────────────────────────────

static async Task ImportGlossary(
    DbContextOptions<AppDbContext> opts, string techSlug, string jsonPath)
{
    if (!File.Exists(jsonPath)) return;

    var doc = Deserialize<GlossaryDocModel>(jsonPath);
    if (doc.Terms is null || doc.Terms.Count == 0) return;

    await using var ctx = new AppDbContext(opts);
    var existing = await ctx.GlossaryEntries
        .Where(g => g.TechSlug == techSlug)
        .ToDictionaryAsync(g => g.Term);

    foreach (var t in doc.Terms)
    {
        if (existing.TryGetValue(t.Term, out var dbEntry))
            dbEntry.Update(t.Definition);
        else
            ctx.GlossaryEntries.Add(GlossaryEntry.Create(techSlug, t.Term, t.Definition));
    }

    await ctx.SaveChangesAsync();
    Console.WriteLine($"    ~ glossary ({doc.Terms.Count} terms)");
}

// ── Frontmatter ───────────────────────────────────────────────────────────────

static (string fm, string body) SplitFrontmatter(string raw)
{
    if (!raw.TrimStart().StartsWith("---")) return ("", raw);
    var start = raw.IndexOf("---") + 3;
    var end = raw.IndexOf("\n---", start);
    if (end < 0) return ("", raw);
    return (raw[start..end].Trim(), raw[(end + 4)..].TrimStart());
}

static LessonFrontmatterModel ParseFrontmatter(string yaml)
{
    var d = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .IgnoreUnmatchedProperties()
        .Build();
    return d.Deserialize<LessonFrontmatterModel>(yaml) ?? new LessonFrontmatterModel();
}

// ── Quiz extraction ───────────────────────────────────────────────────────────

static IEnumerable<QuizData> ExtractQuizzes(string mdx)
{
    foreach (Match m in Config.QuizRegex.Matches(mdx))
    {
        var block = m.Groups[1].Value;

        var id          = ExtractAttr(block, "id");
        var question    = ExtractAttr(block, "question");
        var explanation = ExtractAttr(block, "explanation");
        if (id is null || question is null || explanation is null) continue;

        var options = ExtractOptions(block);
        if (options is null || options.Length == 0) continue;

        var caMatch = Regex.Match(block, @"correctAnswer=\{(\d+)\}");
        if (!caMatch.Success || !int.TryParse(caMatch.Groups[1].Value, out var ca)) continue;

        yield return new QuizData(id.Trim(), question.Trim(), options, ca, explanation.Trim());
    }
}

static string? ExtractAttr(string block, string name)
{
    // double-quoted string
    var m = Regex.Match(block, $@"{name}=""((?:[^""\\]|\\.)*)""", RegexOptions.Singleline);
    if (m.Success) return m.Groups[1].Value;

    // template literal  `...`
    m = Regex.Match(block, $@"{name}=\{{`(.*?)`\}}", RegexOptions.Singleline);
    return m.Success ? m.Groups[1].Value : null;
}

static string[]? ExtractOptions(string block)
{
    var m = Regex.Match(block, @"options=\{\[(.*?)\]\}", RegexOptions.Singleline);
    if (!m.Success) return null;

    return Regex.Matches(m.Groups[1].Value, @"""((?:[^""\\]|\\.)*)""")
        .Select(x => x.Groups[1].Value.Trim())
        .ToArray();
}

// QuizRegex and JsonOpts live in Config (cannot be top-level static fields)

// ── Enum helpers ──────────────────────────────────────────────────────────────

static LessonDifficulty MapDifficulty(string s) => s.ToLowerInvariant() switch
{
    "intermediate" => LessonDifficulty.Intermediate,
    "advanced"     => LessonDifficulty.Advanced,
    "expert"       => LessonDifficulty.Expert,
    _              => LessonDifficulty.Foundation
};

static PhaseLevel MapLevel(string s) => s.ToLowerInvariant() switch
{
    "mid"    => PhaseLevel.Mid,
    "senior" => PhaseLevel.Senior,
    _        => PhaseLevel.Junior
};

// ── File helpers ──────────────────────────────────────────────────────────────

static T Deserialize<T>(string path) where T : new() =>
    JsonSerializer.Deserialize<T>(File.ReadAllText(path), Config.JsonOpts) ?? new T();

static string FindContentRoot()
{
    var dir = AppContext.BaseDirectory;
    while (dir is not null)
    {
        var candidate = Path.Combine(dir, "frontend", "content", "technologies");
        if (Directory.Exists(candidate)) return candidate;
        dir = Directory.GetParent(dir)?.FullName;
    }
    throw new DirectoryNotFoundException(
        "Cannot locate frontend/content/technologies. Pass it as the second argument.");
}

static string MaskPassword(string s)
{
    var idx = s.IndexOf("Password=", StringComparison.OrdinalIgnoreCase);
    return idx < 0 ? s : s[..idx] + "Password=***";
}

// ── Config ────────────────────────────────────────────────────────────────────

static class Config
{
    public static readonly Regex QuizRegex =
        new(@"<Quiz\s+(.*?)\s*/>", RegexOptions.Singleline | RegexOptions.Compiled);

    public static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy        = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition      = JsonIgnoreCondition.WhenWritingNull,
    };
}

// ── Models ────────────────────────────────────────────────────────────────────

record QuizData(string Id, string Question, string[] Options, int CorrectAnswer, string Explanation);

class TechModel
{
    public string  Slug        { get; set; } = "";
    public string  Title       { get; set; } = "";
    public string? Description { get; set; }
    public string? Icon        { get; set; }
    public int     Order       { get; set; }
}

class PhaseMetaModel
{
    public string  Slug        { get; set; } = "";
    public int     Number      { get; set; }
    public string  Title       { get; set; } = "";
    public string? Description { get; set; }
    public string  Level       { get; set; } = "junior";
}

class LessonFrontmatterModel
{
    public string         Title      { get; set; } = "";
    public string         Slug       { get; set; } = "";
    public int            Order      { get; set; }
    public string         Difficulty { get; set; } = "foundation";
    public int            ReadingTime { get; set; }
    public string         Status     { get; set; } = "published";
    public bool           QuestMode  { get; set; }
    public List<string>   Tags       { get; set; } = [];
    public string?        Summary    { get; set; }
    public List<DocLinkModel> DocsLinks { get; set; } = [];
}

class DocLinkModel
{
    public string Label { get; set; } = "";
    public string Url   { get; set; } = "";
}

class CheatsheetDocModel
{
    public List<CheatsheetSectionModel>? Sections { get; set; }
}

class CheatsheetSectionModel
{
    public string              Id      { get; set; } = "";
    public string              Title   { get; set; } = "";
    public List<JsonElement>?  Content { get; set; }
}

class GlossaryDocModel
{
    public List<GlossaryTermModel>? Terms { get; set; }
}

class GlossaryTermModel
{
    public string Term       { get; set; } = "";
    public string Definition { get; set; } = "";
}
