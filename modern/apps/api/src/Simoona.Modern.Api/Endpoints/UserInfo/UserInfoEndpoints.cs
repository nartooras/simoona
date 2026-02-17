using Microsoft.EntityFrameworkCore;
using Simoona.Modern.Api.ReadDb;
using Simoona.Modern.Api.TenantContext;

namespace Simoona.Modern.Api.Endpoints.UserInfo;

public static class UserInfoEndpoints
{
    public static RouteGroupBuilder MapUserInfoEndpoints(this RouteGroupBuilder apiV1)
    {
        apiV1.MapGet("/account/user-info", GetUserInfoAsync)
            .WithName("GetUserInfo")
            .Produces<UserInfoResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        return apiV1;
    }

    private static async Task<IResult> GetUserInfoAsync(
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

        var userId = currentUserResolver.ResolveUserId(httpContext);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Results.Problem(
                title: "Missing user context.",
                detail: $"Provide an authenticated user claim or '{HttpCurrentUserResolver.UserIdHeader}' header.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var user = await dbContext.Users
            .FirstOrDefaultAsync(
                x => x.Id == userId && x.OrganizationId == organizationId,
                cancellationToken);

        if (user is null)
        {
            return Results.NotFound();
        }

        var response = new UserInfoResponse(
            Email: user.Email,
            HasRegistered: true,
            LoginProvider: "Local",
            Impersonated: false,
            OrganizationId: user.OrganizationId,
            UserId: user.Id,
            UserName: user.UserName,
            FullName: $"{user.FirstName} {user.LastName}".Trim(),
            CultureCode: user.CultureCode,
            TimeZone: user.TimeZone,
            PictureId: user.PictureId,
            Permissions: Array.Empty<string>(),
            Roles: Array.Empty<string>());

        return Results.Ok(response);
    }
}
