using Microsoft.EntityFrameworkCore;
using Simoona.Modern.Api.ReadDb;

namespace Simoona.Modern.Api.Tests.ReadDb;

public sealed class ReadOnlySaveGuardInterceptorTests
{
    [Fact]
    public async Task SaveChangesAsync_WhenCalled_ThrowsReadOnlyError()
    {
        var options = new DbContextOptionsBuilder<ModernReadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .AddInterceptors(new ReadOnlySaveGuardInterceptor())
            .Options;

        await using var dbContext = new ModernReadDbContext(options);
        dbContext.Users.Add(new LegacyUserReadModel
        {
            Id = "user-3",
            OrganizationId = 7,
            UserName = "blocked-write"
        });

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => dbContext.SaveChangesAsync());
        Assert.Contains("Write operations are disabled", exception.Message);
    }
}
