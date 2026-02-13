namespace Simoona.Modern.Api.TenantContext;

public sealed class HeaderTenantContextResolver : ITenantContextResolver
{
    public const string TenantHeader = "X-Tenant-Id";
    public const string OrganizationHeader = "X-Org-Id";
    public const string LegacyOrganizationHeader = "Organization";

    public TenantContextData Resolve(HttpContext httpContext)
    {
        var tenantId = httpContext.Request.Headers[TenantHeader].FirstOrDefault();
        var organizationId = httpContext.Request.Headers[OrganizationHeader].FirstOrDefault()
            ?? httpContext.Request.Headers[LegacyOrganizationHeader].FirstOrDefault();
        return new TenantContextData(tenantId, organizationId);
    }
}
