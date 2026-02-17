using Microsoft.AspNetCore.Mvc.Testing;
using Simoona.Modern.Api.Tests.Infrastructure;

namespace Simoona.Modern.Api.Tests.Contracts;

public abstract class ContractTestBase : IClassFixture<ModernApiTestFactory>
{
    protected ContractTestBase(ModernApiTestFactory factory)
    {
        HttpClient = factory.CreateClient();
    }

    protected HttpClient HttpClient { get; }
}
