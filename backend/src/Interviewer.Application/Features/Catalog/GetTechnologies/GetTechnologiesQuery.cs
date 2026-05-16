using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Catalog.GetTechnologies;

public record GetTechnologiesQuery(bool PublishedOnly = true)
    : IRequest<Result<List<TechnologyDto>>>;
