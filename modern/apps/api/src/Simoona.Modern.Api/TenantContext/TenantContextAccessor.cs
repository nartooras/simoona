using System.Threading;

namespace Simoona.Modern.Api.TenantContext;

public sealed class TenantContextAccessor : ITenantContextAccessor
{
    private static readonly AsyncLocal<TenantContextDataHolder> Storage = new();

    public TenantContextData Current
    {
        get => Storage.Value?.Data ?? new TenantContextData(null, null);
        set => Storage.Value = new TenantContextDataHolder(value);
    }

    private sealed record TenantContextDataHolder(TenantContextData Data);
}
