namespace Server.Main.WebApi.Test.Service;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Server.Main.WebApi.Service;
using Xunit;

public class AddCloudCqsOptionsExtentionTest
{
    [Fact]
    public void CloudCqsOptionsを追加できる()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddCloudCqsOptions();

        var serviceDescriptors = builder.Services.Where(
            serviceDescriptor => serviceDescriptor.ServiceType == typeof(CloudCqsOptions<>)
        );

        Assert.Single(serviceDescriptors);

        var app = builder.Build();

        using var scope = app.Services.CreateScope();
        var cloudCqsOptions = scope.ServiceProvider.GetRequiredService<CloudCqsOptions<object>>();

        Assert.NotNull(cloudCqsOptions.RepositoryExecuted);
        Assert.NotNull(cloudCqsOptions.RepositoryTerminated);
        Assert.NotNull(cloudCqsOptions.FunctionExecuted);
        Assert.NotNull(cloudCqsOptions.FunctionTerminated);
    }
}
