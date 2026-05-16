using Interviewer.Application.Features.Catalog.GetTechnologies;
using MediatR;

namespace Interviewer.Api.Endpoints;

public static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/technologies")
            .WithTags("Catalog")
            .WithOpenApi();

        group.MapGet("/", GetTechnologies)
            .WithName("GetTechnologies")
            .WithSummary("Returns all published technologies");
    }

    private static async Task<IResult> GetTechnologies(
        ISender sender,
        CancellationToken ct,
        bool publishedOnly = true)
    {
        var result = await sender.Send(new GetTechnologiesQuery(publishedOnly), ct);

        return result.IsSuccess
            ? Results.Ok(result.Value)
            : Results.Problem(result.Error);
    }
}
