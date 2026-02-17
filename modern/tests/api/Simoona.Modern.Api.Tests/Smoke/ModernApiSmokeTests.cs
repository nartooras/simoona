using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Simoona.Modern.Api.Tests.Contracts;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Smoke;

[Trait("Category", "Smoke")]
public sealed class ModernApiSmokeTests : ContractTestBase
{
    public ModernApiSmokeTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task HealthProbe_ReturnsHealthy()
    {
        var response = await HttpClient.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var payload = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.NotNull(payload);
        Assert.True(payload.RootElement.TryGetProperty("status", out var statusElement));
        Assert.Equal("healthy", statusElement.GetString());
    }

    [Theory]
    [InlineData("/api/v1/account/user-info")]
    [InlineData("/api/v1/user/general-settings")]
    [InlineData("/api/v1/employees")]
    [InlineData("/api/v1/profiles/me")]
    public async Task MigratedEndpoints_WithoutToken_ReturnUnauthorized(string path)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, path);
        request.Headers.Add("X-Org-Id", "7");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/v1/account/user-info", "userId")]
    [InlineData("/api/v1/user/general-settings", "languages")]
    [InlineData("/api/v1/employees?page=1&pageSize=10", "pagedList")]
    [InlineData("/api/v1/profiles/me", "id")]
    public async Task MigratedEndpoints_WithDevToken_ReturnHappyPathPayload(string path, string expectedProperty)
    {
        var token = await CreateDevelopmentTokenAsync();

        using var request = new HttpRequestMessage(HttpMethod.Get, path);
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var payload = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.NotNull(payload);
        Assert.True(
            payload.RootElement.TryGetProperty(expectedProperty, out _),
            $"Expected '{expectedProperty}' property in response payload for '{path}'.");
    }

    private async Task<string> CreateDevelopmentTokenAsync()
    {
        var response = await HttpClient.PostAsJsonAsync(
            "/api/v1/dev-auth/token",
            new
            {
                userId = "user-1",
                organizationId = "7",
                tenantId = "tenant-a",
                expiresMinutes = 60
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<DevelopmentTokenResponse>();
        Assert.NotNull(payload);
        Assert.False(string.IsNullOrWhiteSpace(payload.AccessToken));

        return payload.AccessToken;
    }

    private sealed record DevelopmentTokenResponse(string AccessToken);
}
