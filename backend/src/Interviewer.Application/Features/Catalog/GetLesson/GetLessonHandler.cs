using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Features.Catalog.GetLesson;

public class GetLessonHandler(IAppDbContext db) : IRequestHandler<GetLessonQuery, Result<LessonDetailDto>>
{
    public async Task<Result<LessonDetailDto>> Handle(GetLessonQuery request, CancellationToken cancellationToken)
    {
        var lesson = await db.Lessons
            .Where(l => l.PhaseId == request.PhaseId && l.Slug == request.Slug && l.IsPublished)
            .Select(l => new
            {
                Lesson = l,
                CurrentVersion = db.LessonVersions
                    .Where(v => v.Id == l.CurrentVersionId)
                    .Select(v => new
                    {
                        Version = v,
                        Challenges = db.Challenges
                            .Where(c => c.LessonVersionId == v.Id)
                            .OrderBy(c => c.Key)
                            .Select(c => new
                            {
                                Challenge = c,
                                Options = db.ChallengeOptions
                                    .Where(o => o.ChallengeId == c.Id)
                                    .OrderBy(o => o.DisplayOrder)
                                    .ToList()
                            })
                            .ToList()
                    })
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (lesson is null)
            return Result<LessonDetailDto>.Failure("Lesson not found.");

        var currentVersionDto = lesson.CurrentVersion is null ? null : new LessonVersionDto(
            lesson.CurrentVersion.Version.Id,
            lesson.CurrentVersion.Version.VersionNumber,
            lesson.CurrentVersion.Version.ContentMdx,
            lesson.CurrentVersion.Version.FrontmatterJson,
            lesson.CurrentVersion.Version.Status.ToString(),
            lesson.CurrentVersion.Version.PublishedAt,
            lesson.CurrentVersion.Challenges.Select(c => new ChallengeDto(
                c.Challenge.Id,
                c.Challenge.Key,
                c.Challenge.Type.ToString(),
                c.Challenge.Title,
                c.Challenge.Question,
                c.Challenge.Language,
                c.Challenge.Code,
                c.Challenge.Explanation,
                c.Options.Select(o => new ChallengeOptionDto(
                    o.Id,
                    o.DisplayOrder,
                    o.Value,
                    o.Label,
                    o.IsCorrect)).ToList()
            )).ToList());

        var dto = new LessonDetailDto(
            lesson.Lesson.Id,
            lesson.Lesson.PhaseId,
            lesson.Lesson.Slug,
            lesson.Lesson.Title,
            lesson.Lesson.Summary,
            lesson.Lesson.Difficulty.ToString(),
            lesson.Lesson.ReadingTimeMinutes,
            lesson.Lesson.DisplayOrder,
            lesson.Lesson.CurrentVersionId,
            lesson.Lesson.IsPublished,
            currentVersionDto);

        return Result<LessonDetailDto>.Success(dto);
    }
}
