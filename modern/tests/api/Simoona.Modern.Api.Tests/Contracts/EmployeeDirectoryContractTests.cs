using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Simoona.Modern.Api.Endpoints.Employees;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts;

public sealed class EmployeeDirectoryContractTests : ContractTestBase
{
    public EmployeeDirectoryContractTests(ModernApiTestFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetEmployeeDirectory_WithoutToken_ReturnsUnauthorized()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees");
        request.Headers.Add("X-Org-Id", "7");

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetEmployeeDirectory_WithValidContext_ReturnsPagedDirectory()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees?page=1&pageSize=10");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<EmployeeDirectoryResponse>();
        Assert.NotNull(payload);
        Assert.Equal(10, payload.PageSize);
        Assert.True(payload.ItemCount >= 1);
        Assert.Contains(payload.PagedList, employee => employee.Id == "user-1" && employee.JobTitle == "Engineering Manager");
    }

    [Fact]
    public async Task GetEmployeeDirectory_WithoutOrganizationHeader_ReturnsBadRequest()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetEmployeeDirectory_WhenTokenOrganizationDoesNotMatchHeader_ReturnsForbidden()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "9"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetEmployeeDirectory_WhenCurrentUserDoesNotExist_ReturnsNotFound()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "missing-user", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetEmployeeDirectory_WithSearchThatMatchesNoUsers_ReturnsEmptyPage()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/employees?search=does-not-exist");
        request.Headers.Add("X-Org-Id", "7");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            TestJwtTokenFactory.CreateToken(userId: "user-1", orgId: "7"));

        var response = await HttpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<EmployeeDirectoryResponse>();
        Assert.NotNull(payload);
        Assert.Empty(payload.PagedList);
        Assert.Equal(0, payload.ItemCount);
        Assert.Equal(0, payload.PageCount);
    }
}
