using FluentValidation;

namespace Interviewer.Application.Features.Identity.Register;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8);

        RuleFor(x => x.DisplayName)
            .MaximumLength(64)
            .When(x => x.DisplayName is not null);
    }
}
