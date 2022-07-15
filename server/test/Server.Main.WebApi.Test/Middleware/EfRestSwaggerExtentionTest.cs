namespace Server.Main.WebApi.Test.Middleware;

using Xunit;
using Xunit.Abstractions;

public class EfRestSwaggerExtentionTest
{
    private readonly ITestOutputHelper output;

    public EfRestSwaggerExtentionTest(ITestOutputHelper output)
    {
        this.output = output;
    }

    [Fact]
    public async Task EfRest経由でSwaggerJsonが取得できる()
    {
        var factory = new TestWebApplicationFactory(this.output);
        var client = factory.CreateClient();
        var response = await client.GetAsync("/swagger/v1/swagger.json");
        var stream = await response.Content.ReadAsStreamAsync();
        var reader = new StreamReader(stream);
        var buf = reader.ReadToEnd();

        Assert.True(buf.Any());
    }
}
