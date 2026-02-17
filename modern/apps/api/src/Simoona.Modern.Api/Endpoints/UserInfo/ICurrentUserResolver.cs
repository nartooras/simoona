namespace Simoona.Modern.Api.Endpoints.UserInfo;

public interface ICurrentUserResolver
{
    string? ResolveUserId(HttpContext httpContext);
}
