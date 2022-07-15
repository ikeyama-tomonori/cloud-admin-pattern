namespace Server.Main.WebApi.Test.Middleware;

using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

public class EfRestExtentionTest
{
    private readonly ITestOutputHelper output;

    public EfRestExtentionTest(ITestOutputHelper output)
    {
        this.output = output;
    }

    [Fact]
    public async Task EfRest経由でアクセスできる()
    {
        var factory = new TestWebApplicationFactory(this.output);
        var client = factory.CreateClient();
        var guid = Guid.NewGuid();
        var name = $"EfRestTest {guid}";
        var response = await client.PostAsJsonAsync("/api/organizations", new { Name = name });
        var created = await response.Content.ReadFromJsonAsync<Model.Organization>();

        Assert.Equal(name, created?.Name);
    }
}
