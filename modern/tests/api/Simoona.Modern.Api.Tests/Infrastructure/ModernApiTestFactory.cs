using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Simoona.Modern.Api.ReadDb;

namespace Simoona.Modern.Api.Tests.Infrastructure;

public sealed class ModernApiTestFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"modern-api-tests-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Auth:Jwt:Issuer", TestJwtTokenFactory.Issuer);
        builder.UseSetting("Auth:Jwt:Audience", TestJwtTokenFactory.Audience);
        builder.UseSetting("Auth:Jwt:SigningKey", TestJwtTokenFactory.SigningKey);
        builder.UseSetting("Auth:Jwt:Authority", string.Empty);
        builder.UseSetting("Auth:Jwt:RequireHttpsMetadata", "false");
        builder.UseSetting("Auth:DevToken:Enabled", "true");

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<ModernReadDbContext>>();
            services.RemoveAll<ModernReadDbContext>();

            services.AddDbContext<ModernReadDbContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ModernReadDbContext>();
        dbContext.Database.EnsureCreated();
        if (!dbContext.JobPositions.Any())
        {
            dbContext.JobPositions.AddRange(
                new LegacyJobPositionReadModel
                {
                    Id = 1,
                    Title = "Engineering Manager"
                },
                new LegacyJobPositionReadModel
                {
                    Id = 2,
                    Title = "Principal Engineer"
                });
            dbContext.SaveChanges();
        }

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
                    JobPositionId = 1,
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
                    JobPositionId = 2,
                    CultureCode = "en-US",
                    TimeZone = "UTC",
                    PictureId = "pic-2"
                });
            dbContext.SaveChanges();
        }

        return host;
    }
}
