using Interviewer.Application.Common.Models;
using MediatR;

namespace Interviewer.Application.Features.Identity.Register;

public record RegisterCommand(string Email, string Password, string? DisplayName) : IRequest<Result<RegisterResponse>>;
