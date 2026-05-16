using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Catalog.GetPhases;

public record GetPhasesQuery(string TechSlug, bool PublishedOnly = true) : IRequest<Result<List<PhaseDto>>>;
