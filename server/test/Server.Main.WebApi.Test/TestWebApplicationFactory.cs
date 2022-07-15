namespace Server.Main.WebApi.Test;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

internal class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly ITestOutputHelper output;

    public TestWebApplicationFactory(ITestOutputHelper output)
    {
        this.output = output;
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders();
            logging.AddXunit(this.output);
        });

        return base.CreateHost(builder);
    }
}
