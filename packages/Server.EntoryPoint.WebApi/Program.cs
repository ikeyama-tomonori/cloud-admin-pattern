using System.Text;
using System.Text.Json;
using EfRest.Swagger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Writers;
using Server.EntoryPoint.WebApi;
using Server.Repository.AppDb;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(
    (services, options) =>
    {
        var jsonSerializerOptions = services
            .GetService<IOptions<JsonOptions>>()
            ?.Value.JsonSerializerOptions;
        var dbSecretJson = builder.Configuration["DbSecret"];
        var dbSecret = dbSecretJson is string json
            ? JsonSerializer.Deserialize<DbSecret>(json, jsonSerializerOptions)
            : null;
        var connectionString = dbSecret is not null
            ? $"Server='{dbSecret.Host}';User='{dbSecret.Username}';Password='{dbSecret.Password}';Database=db"
            : builder.Configuration.GetConnectionString("AppDb");
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

var app = builder.Build();

app.UseAuthorization();
app.UseSwaggerUI();
app.MapGet(
    "/swagger/v1/swagger.json",
    (AppDbContext db, IOptions<JsonOptions> options, HttpResponse response) =>
    {
        var jsonSerializerOptions = options.Value.JsonSerializerOptions;
        var swaggerGen = new EfRestSwagger(db, jsonSerializerOptions);
        var swagger = swaggerGen.GetSwagger(
            documentName: "Project Admin AP",
            documentVersion: "v1",
            host: null,
            basePath: "/api"
        );
        var builder = new StringBuilder();
        var writer = new StringWriter(builder);
        var jsonWriter = new OpenApiJsonWriter(writer);
        swagger.SerializeAsV3(jsonWriter);
        var json = builder.ToString();
        response.Headers.Add("content-type", "application/json");
        return json;
    }
);
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.Map(
    "/api/{**path}",
    [TypeFilter(typeof(StatusCodeExceptionFilter))]
    async (
        AppDbContext db,
        ILogger<EfRest.EfRestServer> logger,
        IOptions<JsonOptions> options,
        HttpRequest request,
        HttpResponse response
    ) =>
    {
        var jsonSerializerOptions = options.Value.JsonSerializerOptions;
        var efrest = new EfRest.EfRestServer(db)
        {
            CloudCqsOptions = new()
            {
                RepositoryExecuted = p =>
                    logger.LogInformation(
                        "Executed: {Class} request={Request}, response={Response} in {TotalMilliseconds}ms",
                        p.RepositoryType.Name,
                        p.Request,
                        p.Response,
                        p.TimeSpan.TotalMilliseconds
                    ),
                RepositoryTerminated = p =>
                    logger.LogWarning(
                        "Terminated: {Class} request={Request}, exception={Exception} in {TotalMilliseconds}ms",
                        p.RepositoryType.Name,
                        p.Request,
                        p.Exception,
                        p.TimeSpan.TotalMilliseconds
                    ),
                FunctionExecuted = p =>
                    logger.LogInformation(
                        "Executed: {Class}[{Description}] param={Param}, result={p.Result} in {TotalMilliseconds}ms",
                        p.RepositoryType.Name,
                        p.Description,
                        p.Param,
                        p.Result,
                        p.TimeSpan.TotalMilliseconds
                    ),
                FunctionTerminated = p =>
                    logger.LogWarning(
                        "Terminated: {Class}[{Description}] param={p.Param}, exception={Exception} in {TotalMilliseconds}ms",
                        p.RepositoryType.Name,
                        p.Description,
                        p.Param,
                        p.Exception,
                        p.TimeSpan.TotalMilliseconds
                    ),
            },
            JsonSerializerOptions = jsonSerializerOptions,
        };
        var method = request.Method;
        using var requestStream = new StreamReader(request.Body, Encoding.UTF8);
        var body = await requestStream.ReadToEndAsync();
        var pathAndQuery = $"{request.Path}{request.QueryString}"[5..];
        var (statusCode, headers, responseBody) = await efrest.Request(method, pathAndQuery, body);
        response.StatusCode = statusCode;
        foreach (var (key, value) in headers)
        {
            response.Headers.Add(key, value);
        }

        return responseBody;
    }
);

app.Run();
