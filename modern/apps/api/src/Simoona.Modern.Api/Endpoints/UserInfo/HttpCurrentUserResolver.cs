using System.Security.Claims;

namespace Simoona.Modern.Api.Endpoints.UserInfo;

public sealed class HttpCurrentUserResolver : ICurrentUserResolver
{
    public const string UserIdHeader = "X-User-Id";
    private readonly bool _allowHeaderFallback;

    public HttpCurrentUserResolver(IHostEnvironment hostEnvironment)
    {
        _allowHeaderFallback = hostEnvironment.IsDevelopment() || hostEnvironment.IsEnvironment("Testing");
    }

    public string? ResolveUserId(HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? httpContext.User.FindFirstValue("sub");

        if (!string.IsNullOrWhiteSpace(userId))
        {
            return userId;
        }

        if (!_allowHeaderFallback)
        {
            return null;
        }

        return httpContext.Request.Headers[UserIdHeader].FirstOrDefault();
    }
}
