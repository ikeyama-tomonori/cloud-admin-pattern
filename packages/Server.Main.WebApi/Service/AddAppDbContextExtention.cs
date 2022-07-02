namespace Server.Main.WebApi.Service;

using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Server.Repository.AppDb;

public static class AddAppDbContextExtention
{
    public static IServiceCollection AddAppDbContext(
        this IServiceCollection services,
        IConfiguration config
    ) =>
        services.AddDbContext<AppDbContext>(
            (services, options) =>
            {
                var jsonSerializerOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
                var dbSecretJson = config["DbSecret"];
                var dbSecret = dbSecretJson is string json
                    ? JsonSerializer.Deserialize<DbSecret>(json, jsonSerializerOptions)
                    : null;
                var connectionString = dbSecret is (string host, string username, string password)
                    ? $"Server='{host}';User='{username}';Password='{password}';Database=db"
                    : config.GetConnectionString("AppDb");
                var serverVersion = ServerVersion.AutoDetect(connectionString);

                options
                    .UseMySql(
                        connectionString,
                        serverVersion,
                        options => options.MigrationsAssembly("Server.EntoryPoint.AppDbMigration")
                    )
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors();
            }
        );
}
