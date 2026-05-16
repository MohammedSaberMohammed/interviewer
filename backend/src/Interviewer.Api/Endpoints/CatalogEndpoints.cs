using Interviewer.Application.Features.Catalog.GetLesson;
using Interviewer.Application.Features.Catalog.GetLessons;
using Interviewer.Application.Features.Catalog.GetPhases;
using Interviewer.Application.Features.Catalog.GetTechnologies;
using MediatR;

namespace Interviewer.Api.Endpoints;

public static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1")
            .WithTags("Catalog")
            .WithOpenApi();

        group.MapGet("/technologies", GetTechnologies)
            .WithName("GetTechnologies")
            .WithSummary("Returns all published technologies");

        group.MapGet("/technologies/{techSlug}/phases", GetPhases)
            .WithName("GetPhases")
            .WithSummary("Returns all published phases for a technology");

        group.MapGet("/phases/{phaseId:long}/lessons", GetLessons)
            .WithName("GetLessons")
            .WithSummary("Returns all published lessons for a phase");

        group.MapGet("/phases/{phaseId:long}/lessons/{slug}", GetLesson)
            .WithName("GetLesson")
            .WithSummary("Returns a published lesson with its current version content");
    }

    private static async Task<IResult> GetTechnologies(
        ISender sender,
        CancellationToken ct,
        bool publishedOnly = true)
    {
        var result = await sender.Send(new GetTechnologiesQuery(publishedOnly), ct);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.Problem(result.Error);
    }

    private static async Task<IResult> GetPhases(
        string techSlug,
        ISender sender,
        CancellationToken ct,
        bool publishedOnly = true)
    {
        var result = await sender.Send(new GetPhasesQuery(techSlug, publishedOnly), ct);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.Problem(result.Error, statusCode: 404);
    }

    private static async Task<IResult> GetLessons(
        long phaseId,
        ISender sender,
        CancellationToken ct,
        bool publishedOnly = true)
    {
        var result = await sender.Send(new GetLessonsQuery(phaseId, publishedOnly), ct);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.Problem(result.Error, statusCode: 404);
    }

    private static async Task<IResult> GetLesson(
        long phaseId,
        string slug,
        ISender sender,
        CancellationToken ct)
    {
        var result = await sender.Send(new GetLessonQuery(phaseId, slug), ct);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.Problem(result.Error, statusCode: 404);
    }
}
