namespace Simoona.Modern.Api.TenantContext;

public interface ITenantContextResolver
{
    TenantContextData Resolve(HttpContext httpContext);
}
