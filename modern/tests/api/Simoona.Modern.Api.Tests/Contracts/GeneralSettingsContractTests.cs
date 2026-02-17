using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Simoona.Modern.Api.Endpoints.GeneralSettings;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts;

public sealed class GeneralSettingsContractTests : ContractTestBase
{
    public GeneralSettingsContractTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetGeneralSettings_WithoutToken_ReturnsUnauthorized()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Add("X-Org-Id", "7");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetGeneralSettings_WithValidTokenAndExistingUserInOrganization_ReturnsSettingsPayload()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<GeneralSettingsResponse>();
        Assert.NotNull(payload);
        Assert.Contains(payload.Languages, language => language.Name == "en-US");
        Assert.Contains(payload.Languages, language => language.Name == "lt-LT");
        Assert.Contains(payload.TimeZones, timeZone => timeZone.Id == "UTC" && timeZone.IsSelected);
        Assert.Contains(payload.Languages, language => language.Name == "en-US" && language.IsSelected);
    }

    [Fact]
    public async Task GetGeneralSettings_WithoutOrganizationHeader_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", TestJwtTokenFactory.CreateToken(userId: "user-1"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetGeneralSettings_WithInvalidOrganizationHeader_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Add("X-Org-Id", "invalid-org");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetGeneralSettings_WhenTokenOrganizationDoesNotMatchHeader_ReturnsForbidden()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "9"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetGeneralSettings_WhenUserDoesNotExist_ReturnsNotFound()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/user/general-settings");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "missing-user", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
