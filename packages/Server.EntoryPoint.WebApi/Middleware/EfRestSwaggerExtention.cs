namespace Server.EntoryPoint.WebApi.Middleware;

using System.Text;
using EfRest.Swagger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Writers;
using Server.Repository.AppDb;

public static class EfRestSwaggerExtention
{
    public static RouteHandlerBuilder UseEfRestSwagger(this IEndpointRouteBuilder app) =>
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
}
