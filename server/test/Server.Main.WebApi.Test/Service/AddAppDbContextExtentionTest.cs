namespace Server.Main.WebApi.Test.Service;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Server.Main.WebApi.Service;
using Server.Repository.AppDb;
using Xunit;

public class AddAppDbContextExtentionTest
{
    [Fact]
    public void CloudCqsOptionsを追加できる()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddAppDbContext();

        var serviceDescriptors = builder.Services.Where(
            serviceDescriptor => serviceDescriptor.ServiceType == typeof(AppDbContext)
        );

        Assert.Single(serviceDescriptors);

        var app = builder.Build();

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetService<AppDbContext>();

        Assert.NotNull(db);
    }
}
