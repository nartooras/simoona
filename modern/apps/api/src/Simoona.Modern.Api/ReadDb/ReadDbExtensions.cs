using Microsoft.EntityFrameworkCore;

namespace Simoona.Modern.Api.ReadDb;

public static class ReadDbExtensions
{
    public static IServiceCollection AddReadOnlyDataAccess(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<ReadOnlySaveGuardInterceptor>();

        services.AddDbContext<ModernReadDbContext>((serviceProvider, options) =>
        {
            var connectionString = configuration.GetConnectionString("LegacyReadOnly");

            options.UseSqlServer(connectionString);
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            options.AddInterceptors(serviceProvider.GetRequiredService<ReadOnlySaveGuardInterceptor>());
        });

        return services;
    }
}
