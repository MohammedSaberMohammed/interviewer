using Interviewer.Application.Features.Catalog.GetLesson;
using Interviewer.Application.Features.Catalog.GetLessons;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Interviewer.Api.Controllers;

[ApiController]
[Route("api/v1/phases")]
public class PhasesController(ISender sender) : ControllerBase
{
    [HttpGet("{phaseId:long}/lessons")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLessons(long phaseId, CancellationToken ct, bool publishedOnly = true)
    {
        var result = await sender.Send(new GetLessonsQuery(phaseId, publishedOnly), ct);
        if (!result.IsSuccess)
            return Problem(result.Error, statusCode: 404);

        return Ok(result.Value);
    }

    [HttpGet("{phaseId:long}/lessons/{slug}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLesson(long phaseId, string slug, CancellationToken ct)
    {
        var result = await sender.Send(new GetLessonQuery(phaseId, slug), ct);
        if (!result.IsSuccess)
            return Problem(result.Error, statusCode: 404);

        return Ok(result.Value);
    }
}
