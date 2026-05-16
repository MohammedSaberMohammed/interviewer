using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Features.Catalog.GetPhases;

public class GetPhasesHandler(IAppDbContext db) : IRequestHandler<GetPhasesQuery, Result<List<PhaseDto>>>
{
    public async Task<Result<List<PhaseDto>>> Handle(GetPhasesQuery request, CancellationToken cancellationToken)
    {
        var techExists = await db.Technologies.AnyAsync(t => t.Id == request.TechSlug, cancellationToken);
        if (!techExists)
            return Result<List<PhaseDto>>.Failure("Technology not found.");

        var query = db.Phases.Where(p => p.TechSlug == request.TechSlug);
        if (request.PublishedOnly)
            query = query.Where(p => p.IsPublished);

        var phases = await query
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new PhaseDto(
                p.Id,
                p.TechSlug,
                p.Slug,
                p.Title,
                p.Description,
                p.Level.ToString(),
                p.DisplayOrder,
                p.IsPublished))
            .ToListAsync(cancellationToken);

        return Result<List<PhaseDto>>.Success(phases);
    }
}
