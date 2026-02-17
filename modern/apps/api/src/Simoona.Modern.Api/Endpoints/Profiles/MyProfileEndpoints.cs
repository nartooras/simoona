using Microsoft.EntityFrameworkCore;
using Simoona.Modern.Api.Auth;
using Simoona.Modern.Api.Endpoints.UserInfo;
using Simoona.Modern.Api.ReadDb;
using Simoona.Modern.Api.TenantContext;

namespace Simoona.Modern.Api.Endpoints.Profiles;

public static class MyProfileEndpoints
{
    public static RouteGroupBuilder MapMyProfileEndpoints(this RouteGroupBuilder apiV1)
    {
        apiV1.MapGet("/profiles/me", GetMyProfileAsync)
            .WithName("GetMyProfile")
            .RequireAuthorization(AuthorizationPolicies.AuthenticatedUser)
            .Produces<MyProfileResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        return apiV1;
    }

    private static async Task<IResult> GetMyProfileAsync(
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

        var user = await dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId && x.OrganizationId == organizationId)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.Email,
                x.TimeZone,
                x.JobPositionId
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return Results.NotFound();
        }

        string? jobTitle = null;
        if (user.JobPositionId.HasValue)
        {
            jobTitle = await dbContext.JobPositions
                .AsNoTracking()
                .Where(x => x.Id == user.JobPositionId.Value)
                .Select(x => x.Title)
                .FirstOrDefaultAsync(cancellationToken);
        }

        var response = new MyProfileResponse(
            Id: user.Id,
            FullName: $"{user.FirstName} {user.LastName}".Trim(),
            Email: user.Email,
            JobTitle: jobTitle,
            Department: null,
            Office: null,
            TimeZone: user.TimeZone);

        return Results.Ok(response);
    }
}
