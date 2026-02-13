namespace Simoona.Modern.Api.TenantContext;

public interface ITenantContextAccessor
{
    TenantContextData Current { get; set; }
}
