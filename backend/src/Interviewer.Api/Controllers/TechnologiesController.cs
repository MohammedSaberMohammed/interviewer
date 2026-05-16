using Interviewer.Application.Features.Catalog.GetPhases;
using Interviewer.Application.Features.Catalog.GetTechnologies;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Interviewer.Api.Controllers;

[ApiController]
[Route("api/v1/technologies")]
public class TechnologiesController(ISender sender) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct, bool publishedOnly = true)
    {
        var result = await sender.Send(new GetTechnologiesQuery(publishedOnly), ct);
        return Ok(result.Value);
    }

    [HttpGet("{techSlug}/phases")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPhases(string techSlug, CancellationToken ct, bool publishedOnly = true)
    {
        var result = await sender.Send(new GetPhasesQuery(techSlug, publishedOnly), ct);
        if (!result.IsSuccess)
            return Problem(result.Error, statusCode: 404);

        return Ok(result.Value);
    }
}
