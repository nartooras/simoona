using System.Security.Claims;

namespace Simoona.Modern.Api.Endpoints.UserInfo;

public sealed class HttpCurrentUserResolver : ICurrentUserResolver
{
    public const string UserIdHeader = "X-User-Id";

    public string? ResolveUserId(HttpContext httpContext)
    {
        return httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? httpContext.User.FindFirstValue("sub")
            ?? httpContext.Request.Headers[UserIdHeader].FirstOrDefault();
    }
}
