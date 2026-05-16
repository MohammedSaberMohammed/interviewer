using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Catalog.GetLesson;

public record GetLessonQuery(long PhaseId, string Slug) : IRequest<Result<LessonDetailDto>>;
