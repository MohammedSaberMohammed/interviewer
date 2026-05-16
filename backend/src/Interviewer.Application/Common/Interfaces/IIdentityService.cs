using Interviewer.Application.Common.Models;

namespace Interviewer.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<Result<(long UserId, string Email)>> CreateUserAsync(
        string email,
        string password,
        string? displayName,
        CancellationToken ct = default);

    Task<Result<(long UserId, string Email, IList<string> Roles)>> ValidateCredentialsAsync(
        string email,
        string password,
        CancellationToken ct = default);

    Task<bool> UserExistsAsync(string email, CancellationToken ct = default);
}
