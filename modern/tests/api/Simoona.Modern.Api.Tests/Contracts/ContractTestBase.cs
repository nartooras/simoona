using Microsoft.AspNetCore.Mvc.Testing;

namespace Simoona.Modern.Api.Tests.Contracts;

public abstract class ContractTestBase : IClassFixture<WebApplicationFactory<Program>>
{
    protected ContractTestBase(WebApplicationFactory<Program> factory)
    {
        HttpClient = factory.CreateClient();
    }

    protected HttpClient HttpClient { get; }
}
