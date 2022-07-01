namespace Server.EntoryPoint.AppDbMigration;

using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Server.Repository.AppDb;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();
        var jsonSerializerOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var dbSecretJson = config["DbSecret"];
        var dbSecret = dbSecretJson is string json
            ? JsonSerializer.Deserialize<DbSecret>(json, jsonSerializerOptions)
            : null;
        var connectionString = dbSecret is not null
            ? $"Server='{dbSecret.Host}';User='{dbSecret.Username}';Password='{dbSecret.Password}';Database=db"
            : config.GetConnectionString("AppDb");
        var serverVersion = ServerVersion.AutoDetect(connectionString);
        var builder = new DbContextOptionsBuilder<AppDbContext>()
            .UseMySql(
                connectionString,
                serverVersion,
                x => x.MigrationsAssembly("Server.EntoryPoint.AppDbMigration")
            )
            .UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()))
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors();
        var db = new AppDbContext(builder.Options);
        return db;
    }
}
