using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Simoona.Modern.Api.Tests.Contracts;

namespace Simoona.Modern.Api.Tests.Contracts.Skeleton;

public sealed class TenantContextContractTests : ContractTestBase
{
    public TenantContextContractTests(WebApplicationFactory<Program> factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetTenantContext_UsesTenantAndOrganizationHeaders()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/tenant-context");
        request.Headers.Add("X-Tenant-Id", "tenant-a");
        request.Headers.Add("X-Org-Id", "org-b");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<TenantContextResponse>();
        Assert.NotNull(payload);
        Assert.Equal("tenant-a", payload.TenantId);
        Assert.Equal("org-b", payload.OrganizationId);
    }

    [Fact]
    public async Task GetTenantContext_WithoutHeaders_ReturnsNullIdentifiers()
    {
        var response = await HttpClient.GetAsync("/api/v1/tenant-context");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<TenantContextResponse>();
        Assert.NotNull(payload);
        Assert.Null(payload.TenantId);
        Assert.Null(payload.OrganizationId);
    }
}
