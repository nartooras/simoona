using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Simoona.Modern.Api.ReadDb;

namespace Simoona.Modern.Api.Tests.Infrastructure;

public sealed class ModernApiTestFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"modern-api-tests-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<ModernReadDbContext>>();
            services.RemoveAll<ModernReadDbContext>();
            services.RemoveAll<IConfigureOptions<AuthenticationOptions>>();
            services.RemoveAll<IConfigureOptions<AuthenticationSchemeOptions>>();

            services.AddDbContext<ModernReadDbContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                })
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    TestAuthHandler.SchemeName,
                    configureOptions: _ => { });
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ModernReadDbContext>();
        dbContext.Database.EnsureCreated();
        if (!dbContext.Users.Any())
        {
            dbContext.Users.AddRange(
                new LegacyUserReadModel
                {
                    Id = "user-1",
                    OrganizationId = 7,
                    Email = "user1@simoona.local",
                    UserName = "user1",
                    FirstName = "Ada",
                    LastName = "Lovelace",
                    CultureCode = "en-US",
                    TimeZone = "UTC",
                    PictureId = "pic-1"
                },
                new LegacyUserReadModel
                {
                    Id = "user-2",
                    OrganizationId = 9,
                    Email = "user2@simoona.local",
                    UserName = "user2",
                    FirstName = "Grace",
                    LastName = "Hopper",
                    CultureCode = "en-US",
                    TimeZone = "UTC",
                    PictureId = "pic-2"
                });
            dbContext.SaveChanges();
        }

        return host;
    }
}
