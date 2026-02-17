using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Simoona.Modern.Api.Auth;

public static class DevelopmentAuthEndpoints
{
    public static RouteGroupBuilder MapDevelopmentAuthEndpoints(this RouteGroupBuilder apiV1, IHostEnvironment hostEnvironment)
    {
        if (!IsDevOrTesting(hostEnvironment))
        {
            return apiV1;
        }

        apiV1.MapPost("/dev-auth/token", CreateDevelopmentToken)
            .WithName("CreateDevelopmentToken")
            .AllowAnonymous()
            .Produces<DevelopmentTokenResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        return apiV1;
    }

    private static IResult CreateDevelopmentToken(
        DevelopmentTokenRequest? request,
        IConfiguration configuration,
        JwtAuthOptions jwtAuthOptions)
    {
        var tokenOptions = configuration.GetSection(DevTokenOptions.SectionName).Get<DevTokenOptions>() ?? new DevTokenOptions();
        if (!tokenOptions.Enabled)
        {
            return Results.Problem(
                title: "Development token endpoint is disabled.",
                detail: $"Set '{DevTokenOptions.SectionName}:Enabled=true' in Development/Testing to enable token minting.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        if (string.IsNullOrWhiteSpace(jwtAuthOptions.SigningKey))
        {
            return Results.Problem(
                title: "JWT signing key mode is required for development token minting.",
                detail: $"Configure '{JwtAuthOptions.SectionName}:SigningKey' and avoid '{JwtAuthOptions.SectionName}:Authority' when using this endpoint.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var expiresMinutes = request?.ExpiresMinutes ?? tokenOptions.ExpiresMinutes;
        if (expiresMinutes is < 1 or > 1440)
        {
            return Results.Problem(
                title: "Invalid token lifetime.",
                detail: "expiresMinutes must be between 1 and 1440.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var userId = request?.UserId?.Trim();
        if (string.IsNullOrWhiteSpace(userId))
        {
            userId = tokenOptions.DefaultUserId;
        }

        var organizationId = request?.OrganizationId?.Trim();
        if (string.IsNullOrWhiteSpace(organizationId))
        {
            organizationId = tokenOptions.DefaultOrganizationId;
        }

        var tenantId = request?.TenantId?.Trim();
        if (string.IsNullOrWhiteSpace(tenantId))
        {
            tenantId = tokenOptions.DefaultTenantId;
        }

        var now = DateTimeOffset.UtcNow;
        var expiresAt = now.AddMinutes(expiresMinutes);
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthOptions.SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("sub", userId),
            new("org_id", organizationId),
            new("tenant_id", tenantId),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        var token = new JwtSecurityToken(
            issuer: jwtAuthOptions.Issuer,
            audience: jwtAuthOptions.Audience,
            claims: claims,
            notBefore: now.UtcDateTime,
            expires: expiresAt.UtcDateTime,
            signingCredentials: signingCredentials);

        var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);
        return Results.Ok(new DevelopmentTokenResponse(
            AccessToken: encodedToken,
            TokenType: "Bearer",
            ExpiresAtUtc: expiresAt.UtcDateTime));
    }

    private static bool IsDevOrTesting(IHostEnvironment hostEnvironment) =>
        hostEnvironment.IsDevelopment() || hostEnvironment.IsEnvironment("Testing");
}

public sealed record DevelopmentTokenRequest(
    string? UserId,
    string? OrganizationId,
    string? TenantId,
    int? ExpiresMinutes);

public sealed record DevelopmentTokenResponse(
    string AccessToken,
    string TokenType,
    DateTime ExpiresAtUtc);
