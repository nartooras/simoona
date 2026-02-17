using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Simoona.Modern.Api.Endpoints.Profiles;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts;

public sealed class MyProfileContractTests : ContractTestBase
{
    public MyProfileContractTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetMyProfile_WithoutToken_ReturnsUnauthorized()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Add("X-Org-Id", "7");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyProfile_WithValidContext_ReturnsProfile()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<MyProfileResponse>();
        Assert.NotNull(payload);
        Assert.Equal("user-1", payload.Id);
        Assert.Equal("Ada Lovelace", payload.FullName);
        Assert.Equal("Engineering Manager", payload.JobTitle);
    }

    [Fact]
    public async Task GetMyProfile_WithoutOrganizationHeader_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetMyProfile_WhenTokenOrganizationDoesNotMatchHeader_ReturnsForbidden()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "9"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetMyProfile_WithoutUserContext_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: null, orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetMyProfile_WhenUserDoesNotExist_ReturnsNotFound()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/profiles/me");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "missing-user", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
