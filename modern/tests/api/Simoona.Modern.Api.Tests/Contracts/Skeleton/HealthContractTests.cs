using System.Net;
using System.Net.Http.Json;
using Simoona.Modern.Api.Tests.Contracts;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts.Skeleton;

public sealed class HealthContractTests : ContractTestBase
{
    public HealthContractTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetHealth_ReturnsHealthyPayload()
    {
        var response = await HttpClient.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.NotNull(payload);
        Assert.Equal("healthy", payload.Status);
    }
}
