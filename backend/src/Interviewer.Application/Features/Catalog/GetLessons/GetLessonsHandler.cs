using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Features.Catalog.GetLessons;

public class GetLessonsHandler(IAppDbContext db) : IRequestHandler<GetLessonsQuery, Result<List<LessonSummaryDto>>>
{
    public async Task<Result<List<LessonSummaryDto>>> Handle(GetLessonsQuery request, CancellationToken cancellationToken)
    {
        var phaseExists = await db.Phases.AnyAsync(p => p.Id == request.PhaseId, cancellationToken);
        if (!phaseExists)
            return Result<List<LessonSummaryDto>>.Failure("Phase not found.");

        var query = db.Lessons.Where(l => l.PhaseId == request.PhaseId);
        if (request.PublishedOnly)
            query = query.Where(l => l.IsPublished);

        var lessons = await query
            .OrderBy(l => l.DisplayOrder)
            .Select(l => new LessonSummaryDto(
                l.Id,
                l.PhaseId,
                l.Slug,
                l.Title,
                l.Summary,
                l.Difficulty.ToString(),
                l.ReadingTimeMinutes,
                l.DisplayOrder,
                l.IsPublished))
            .ToListAsync(cancellationToken);

        return Result<List<LessonSummaryDto>>.Success(lessons);
    }
}
