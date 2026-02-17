using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Simoona.Modern.Api.Auth;
using Simoona.Modern.Api.Endpoints.UserInfo;
using Simoona.Modern.Api.ReadDb;
using Simoona.Modern.Api.TenantContext;

namespace Simoona.Modern.Api.Endpoints.Employees;

public static class EmployeeDirectoryEndpoints
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 10;

    public static RouteGroupBuilder MapEmployeeDirectoryEndpoints(this RouteGroupBuilder apiV1)
    {
        apiV1.MapGet("/employees", GetEmployeesAsync)
            .WithName("GetEmployeeDirectory")
            .RequireAuthorization(AuthorizationPolicies.AuthenticatedUser)
            .Produces<EmployeeDirectoryResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        return apiV1;
    }

    private static async Task<IResult> GetEmployeesAsync(
        [AsParameters] EmployeeDirectoryQuery query,
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

        var requesterExists = await dbContext.Users
            .AnyAsync(x => x.Id == userId && x.OrganizationId == organizationId, cancellationToken);
        if (!requesterExists)
        {
            return Results.NotFound();
        }

        var page = query.Page ?? DefaultPage;
        var pageSize = query.PageSize ?? DefaultPageSize;
        if (page < 1 || pageSize < 1)
        {
            return Results.Problem(
                title: "Invalid paging arguments.",
                detail: "Query parameters 'page' and 'pageSize' must be positive integers.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var usersQuery = dbContext.Users
            .AsNoTracking()
            .Where(x => x.OrganizationId == organizationId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.Trim();
            usersQuery = usersQuery.Where(x =>
                (x.FirstName ?? string.Empty).Contains(searchTerm) ||
                (x.LastName ?? string.Empty).Contains(searchTerm) ||
                (x.UserName ?? string.Empty).Contains(searchTerm) ||
                (x.Email ?? string.Empty).Contains(searchTerm));
        }

        var itemCount = await usersQuery.CountAsync(cancellationToken);
        var pageCount = itemCount == 0
            ? 0
            : (int)Math.Ceiling((double)itemCount / pageSize);

        var usersPage = await usersQuery
            .OrderBy(x => x.FirstName ?? string.Empty)
            .ThenBy(x => x.LastName ?? string.Empty)
            .ThenBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.Email,
                x.JobPositionId
            })
            .ToListAsync(cancellationToken);

        var jobPositionIds = usersPage
            .Where(x => x.JobPositionId.HasValue)
            .Select(x => x.JobPositionId!.Value)
            .Distinct()
            .ToArray();

        var jobTitlesById = jobPositionIds.Length == 0
            ? new Dictionary<int, string?>()
            : await dbContext.JobPositions
                .AsNoTracking()
                .Where(x => jobPositionIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Title, cancellationToken);

        var response = new EmployeeDirectoryResponse(
            PagedList: usersPage
                .Select(user => new EmployeeDirectoryItemResponse(
                    Id: user.Id,
                    FirstName: user.FirstName ?? string.Empty,
                    LastName: user.LastName ?? string.Empty,
                    JobTitle: user.JobPositionId.HasValue &&
                              jobTitlesById.TryGetValue(user.JobPositionId.Value, out var title)
                        ? title
                        : null,
                    Email: user.Email))
                .ToArray(),
            PageCount: pageCount,
            ItemCount: itemCount,
            PageSize: pageSize);

        return Results.Ok(response);
    }
}
