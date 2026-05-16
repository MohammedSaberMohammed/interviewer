using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Identity.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<LoginResponse>>;
