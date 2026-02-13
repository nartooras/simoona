namespace Simoona.Modern.Api.TenantContext;

public sealed class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext httpContext,
        ITenantContextResolver resolver,
        ITenantContextAccessor tenantContextAccessor,
        ILogger<TenantContextMiddleware> logger)
    {
        tenantContextAccessor.Current = resolver.Resolve(httpContext);

        logger.LogInformation(
            "Tenant context resolved: TenantId={TenantId}, OrganizationId={OrganizationId}",
            tenantContextAccessor.Current.TenantId,
            tenantContextAccessor.Current.OrganizationId);

        await _next(httpContext);
    }
}
