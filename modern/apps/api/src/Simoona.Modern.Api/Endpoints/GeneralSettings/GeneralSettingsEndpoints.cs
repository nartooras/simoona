using Microsoft.EntityFrameworkCore;
using Simoona.Modern.Api.Auth;
using Simoona.Modern.Api.Endpoints.UserInfo;
using Simoona.Modern.Api.ReadDb;
using Simoona.Modern.Api.TenantContext;

namespace Simoona.Modern.Api.Endpoints.GeneralSettings;

public static class GeneralSettingsEndpoints
{
    public static RouteGroupBuilder MapGeneralSettingsEndpoints(this RouteGroupBuilder apiV1)
    {
        apiV1.MapGet("/user/general-settings", GetGeneralSettingsAsync)
            .WithName("GetGeneralSettings")
            .RequireAuthorization(AuthorizationPolicies.AuthenticatedUser)
            .Produces<GeneralSettingsResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        return apiV1;
    }

    private static async Task<IResult> GetGeneralSettingsAsync(
        HttpContext httpContext,
        ITenantContextAccessor tenantContextAccessor,
        ICurrentUserResolver currentUserResolver,
        ModernReadDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!int.TryParse(tenantContextAccessor.Current.OrganizationId, out var organizationId))
        {
            return Results.Problem(
                title: "Missing or invalid organization context.",
                detail: $"Set header '{HeaderTenantContextResolver.OrganizationHeader}' (or 'Organization') to a numeric organization id.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var claimOrganizationIdRaw = httpContext.User.FindFirst("org_id")?.Value;
        if (!string.IsNullOrWhiteSpace(claimOrganizationIdRaw))
        {
            if (!int.TryParse(claimOrganizationIdRaw, out var claimOrganizationId))
            {
                return Results.Problem(
                    title: "Invalid organization claim.",
                    detail: "Authenticated token claim 'org_id' must be numeric.",
                    statusCode: StatusCodes.Status400BadRequest);
            }

            if (claimOrganizationId != organizationId)
            {
                return Results.Problem(
                    title: "Organization scope mismatch.",
                    detail: "Requested organization does not match authenticated token scope.",
                    statusCode: StatusCodes.Status403Forbidden);
            }
        }

        var userId = currentUserResolver.ResolveUserId(httpContext);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Results.Problem(
                title: "Missing user context.",
                detail: $"Provide an authenticated user claim or '{HttpCurrentUserResolver.UserIdHeader}' header.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var userSettings = await dbContext.Users
            .Where(x => x.Id == userId && x.OrganizationId == organizationId)
            .Select(x => new { x.CultureCode, x.TimeZone })
            .FirstOrDefaultAsync(cancellationToken);

        if (userSettings is null)
        {
            return Results.NotFound();
        }

        var response = GeneralSettingsResponseFactory.Create(userSettings.CultureCode, userSettings.TimeZone);
        return Results.Ok(response);
    }
}
