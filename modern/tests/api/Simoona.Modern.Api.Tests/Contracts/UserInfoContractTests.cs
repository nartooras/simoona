using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using Simoona.Modern.Api.Tests.Contracts.Skeleton;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts;

public sealed class UserInfoContractTests : ContractTestBase
{
    public UserInfoContractTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetUserInfo_WithExistingUserInOrganization_ReturnsUserPayload()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/user-info");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Add(TestAuthHandler.UserIdHeader, "user-1");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<UserInfoResponse>();
        Assert.NotNull(payload);
        Assert.Equal("user-1", payload.UserId);
        Assert.Equal(7, payload.OrganizationId);
        Assert.Equal("Ada Lovelace", payload.FullName);
        Assert.True(payload.HasRegistered);
        Assert.Equal("Local", payload.LoginProvider);
    }

    [Fact]
    public async Task GetUserInfo_WithoutOrganizationHeader_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/user-info");
        request.Headers.Add(TestAuthHandler.UserIdHeader, "user-1");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetUserInfo_WithoutUserContext_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/user-info");
        request.Headers.Add("X-Org-Id", "7");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetUserInfo_WhenUserDoesNotExist_ReturnsNotFound()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/user-info");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Add(TestAuthHandler.UserIdHeader, "missing-user");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetUserInfo_WhenUserBelongsToDifferentOrganization_ReturnsNotFound()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/account/user-info");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Add(TestAuthHandler.UserIdHeader, "user-2");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
