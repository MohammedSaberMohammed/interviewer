namespace Interviewer.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(long userId, string email, IEnumerable<string> roles);
    string GenerateRefreshToken();
}
