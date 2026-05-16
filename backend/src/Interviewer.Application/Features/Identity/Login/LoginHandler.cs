using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Identity.Login;

public class LoginHandler(
    IIdentityService identityService,
    IJwtTokenService jwtTokenService)
    : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var validateResult = await identityService.ValidateCredentialsAsync(
            request.Email,
            request.Password,
            cancellationToken);

        if (!validateResult.IsSuccess)
            return Result<LoginResponse>.Failure(validateResult.Error!);

        var (userId, email, roles) = validateResult.Value!;

        var accessToken = jwtTokenService.GenerateAccessToken(userId, email, roles);
        var refreshToken = jwtTokenService.GenerateRefreshToken();

        return Result<LoginResponse>.Success(
            new LoginResponse(userId, email, accessToken, refreshToken));
    }
}
