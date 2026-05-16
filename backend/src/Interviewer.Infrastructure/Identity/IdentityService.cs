using Interviewer.Application.Common.Interfaces;
using Interviewer.Application.Common.Models;
using Interviewer.Infrastructure.Identity.Entities;
using Microsoft.AspNetCore.Identity;

namespace Interviewer.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<Result<(long UserId, string Email)>> CreateUserAsync(
        string email,
        string password,
        string? displayName,
        CancellationToken ct = default)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = displayName
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result<(long, string)>.Failure(errors);
        }

        await userManager.AddToRoleAsync(user, "Learner");

        return Result<(long, string)>.Success((user.Id, user.Email!));
    }

    public async Task<Result<(long UserId, string Email, IList<string> Roles)>> ValidateCredentialsAsync(
        string email,
        string password,
        CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !await userManager.CheckPasswordAsync(user, password))
            return Result<(long, string, IList<string>)>.Failure("Invalid email or password.");

        var roles = await userManager.GetRolesAsync(user);
        return Result<(long, string, IList<string>)>.Success((user.Id, user.Email!, roles));
    }

    public async Task<bool> UserExistsAsync(string email, CancellationToken ct = default) =>
        await userManager.FindByEmailAsync(email) is not null;
}
