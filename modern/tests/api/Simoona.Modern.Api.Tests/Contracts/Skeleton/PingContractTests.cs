using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Simoona.Modern.Api.Tests.Contracts;

namespace Simoona.Modern.Api.Tests.Contracts.Skeleton;

public sealed class PingContractTests : ContractTestBase
{
    public PingContractTests(WebApplicationFactory<Program> factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetPing_ReturnsPongPayload()
    {
        var response = await HttpClient.GetAsync("/api/v1/ping");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<PingResponse>();
        Assert.NotNull(payload);
        Assert.Equal("pong", payload.Message);
    }
}
