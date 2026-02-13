using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Simoona.Modern.Api.Tests;

public sealed class ApiSkeletonTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public ApiSkeletonTests(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsHealthyPayload()
    {
        var response = await _httpClient.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.NotNull(payload);
        Assert.Equal("healthy", payload.Status);
    }

    [Fact]
    public async Task TenantContextEndpoint_UsesTenantAndOrganizationHeaders()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/tenant-context");
        request.Headers.Add("X-Tenant-Id", "tenant-a");
        request.Headers.Add("X-Org-Id", "org-b");

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<TenantContextResponse>();
        Assert.NotNull(payload);
        Assert.Equal("tenant-a", payload.TenantId);
        Assert.Equal("org-b", payload.OrganizationId);
    }

    [Fact]
    public async Task TenantContextEndpoint_ReturnsNullsWhenHeadersAreMissing()
    {
        var response = await _httpClient.GetAsync("/api/v1/tenant-context");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<TenantContextResponse>();
        Assert.NotNull(payload);
        Assert.Null(payload.TenantId);
        Assert.Null(payload.OrganizationId);
    }

    private sealed record HealthResponse(string Status);
    private sealed record TenantContextResponse(string? TenantId, string? OrganizationId);
}
