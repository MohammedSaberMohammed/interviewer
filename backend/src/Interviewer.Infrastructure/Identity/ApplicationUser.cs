using Microsoft.AspNetCore.Identity;

namespace Interviewer.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<long>
{
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? Timezone { get; set; }
    public string? Locale { get; set; }
    public string? PreferencesJson { get; set; }
}
