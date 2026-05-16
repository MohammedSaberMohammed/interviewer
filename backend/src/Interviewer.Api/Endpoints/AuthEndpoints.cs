using Interviewer.Application.Features.Identity.Login;
using Interviewer.Application.Features.Identity.Register;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Interviewer.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/auth")
            .WithTags("Auth")
            .WithOpenApi();

        group.MapPost("/register", Register)
            .WithName("Register")
            .WithSummary("Register a new user account")
            .AllowAnonymous();

        group.MapPost("/login", Login)
            .WithName("Login")
            .WithSummary("Authenticate and receive access + refresh tokens")
            .AllowAnonymous();
    }

    private static async Task<IResult> Register(
        [FromBody] RegisterCommand command,
        ISender sender,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return result.IsSuccess
            ? Results.Created("/api/v1/me", result.Value)
            : Results.Problem(result.Error, statusCode: 400);
    }

    private static async Task<IResult> Login(
        [FromBody] LoginCommand command,
        ISender sender,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : Results.Problem(result.Error, statusCode: 401);
    }
}
