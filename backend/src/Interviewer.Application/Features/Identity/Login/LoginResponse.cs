namespace Interviewer.Application.Features.Identity.Login;

public record LoginResponse(long UserId, string Email, string AccessToken, string RefreshToken);
