using AutoMapper;
using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Interviewer.Application.Features.Catalog.GetTechnologies;

public class GetTechnologiesHandler(IAppDbContext db, IMapper mapper)
    : IRequestHandler<GetTechnologiesQuery, Result<List<TechnologyDto>>>
{
    public async Task<Result<List<TechnologyDto>>> Handle(
        GetTechnologiesQuery request,
        CancellationToken ct)
    {
        var query = db.Technologies.AsNoTracking();

        if (request.PublishedOnly)
            query = query.Where(t => t.IsPublished);

        var technologies = await query
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(ct);

        return Result<List<TechnologyDto>>.Success(mapper.Map<List<TechnologyDto>>(technologies));
    }
}
