namespace Simoona.Modern.Api.Auth;

public sealed class JwtAuthOptions
{
    public const string SectionName = "Auth:Jwt";

    public string? Issuer { get; init; }

    public string? Audience { get; init; }

    public string? Authority { get; init; }

    public string? SigningKey { get; init; }

    public bool RequireHttpsMetadata { get; init; } = true;
}

public sealed class DevTokenOptions
{
    public const string SectionName = "Auth:DevToken";

    public bool Enabled { get; init; }

    public string DefaultUserId { get; init; } = "user-1";

    public string DefaultOrganizationId { get; init; } = "7";

    public string DefaultTenantId { get; init; } = "tenant-a";

    public int ExpiresMinutes { get; init; } = 60;
}
