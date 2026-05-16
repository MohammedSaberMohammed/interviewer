using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Catalog.GetLessons;

public record GetLessonsQuery(long PhaseId, bool PublishedOnly = true) : IRequest<Result<List<LessonSummaryDto>>>;
