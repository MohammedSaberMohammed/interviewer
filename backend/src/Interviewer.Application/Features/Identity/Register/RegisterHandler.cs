using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Identity.Register;

public class RegisterHandler(
    IIdentityService identityService,
    IJwtTokenService jwtTokenService)
    : IRequestHandler<RegisterCommand, Result<RegisterResponse>>
{
    public async Task<Result<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var createResult = await identityService.CreateUserAsync(
            request.Email,
            request.Password,
            request.DisplayName,
            cancellationToken);

        if (!createResult.IsSuccess)
            return Result<RegisterResponse>.Failure(createResult.Error!);

        var (userId, email) = createResult.Value!;

        var accessToken = jwtTokenService.GenerateAccessToken(userId, email, ["Learner"]);
        var refreshToken = jwtTokenService.GenerateRefreshToken();

        return Result<RegisterResponse>.Success(
            new RegisterResponse(userId, email, accessToken, refreshToken));
    }
}
