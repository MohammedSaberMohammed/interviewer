namespace Interviewer.Application.Features.Identity.Register;

public record RegisterResponse(long UserId, string Email, string AccessToken, string RefreshToken);
