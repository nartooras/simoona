namespace Simoona.Modern.Api.TenantContext;

public static class TenantContextExtensions
{
    public static IServiceCollection AddTenantContext(this IServiceCollection services)
    {
        services.AddSingleton<ITenantContextAccessor, TenantContextAccessor>();
        services.AddSingleton<ITenantContextResolver, HeaderTenantContextResolver>();
        return services;
    }

    public static IApplicationBuilder UseTenantContext(this IApplicationBuilder app)
    {
        return app.UseMiddleware<TenantContextMiddleware>();
    }
}
