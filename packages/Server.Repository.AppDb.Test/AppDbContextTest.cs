namespace Server.Repository.AppDb.Test;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Server.Repository.AppDb;
using Xunit;
using Xunit.Abstractions;

public class AppDbContextTest
{
    private readonly ITestOutputHelper output;

    public AppDbContextTest(ITestOutputHelper output)
    {
        this.output = output;
    }

    public static AppDbContext NewDbContext(Action<string> logTo)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();
        var connectionString = config.GetConnectionString("AppDb");
        var serverVersion = ServerVersion.AutoDetect(connectionString);
        var builder = new DbContextOptionsBuilder<AppDbContext>()
            .UseMySql(connectionString, serverVersion)
            .LogTo(action: logTo, minimumLevel: LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors();
        var db = new AppDbContext(builder.Options);

        return db;
    }

    [Fact]
    public async Task DateTimeはUTCとして取得できる()
    {
        var guid = Guid.NewGuid();

        using (var db = NewDbContext(this.output.WriteLine))
        {
            var date = DateTime.Parse("2022-01-01");
            await db.Organizations.AddAsync(
                new()
                {
                    Name = $"Organization [{guid}]",
                    Projects = new()
                    {
                        new()
                        {
                            Name = $"Project 1 [{guid}]",
                            InitialStart = date,
                            InitialEnd = date,
                            PlanedStart = date,
                            PlanedEnd = date,
                        },
                    },
                }
            );
            await db.SaveChangesAsync();
        }

        using (var db = NewDbContext(this.output.WriteLine))
        {
            var project = await db.Projects.SingleAsync(
                project => project.Name == $"Project 1 [{guid}]"
            );
            var date = project.InitialStart;
            Assert.Equal(DateTimeKind.Utc, date.Kind);
        }
    }
}
