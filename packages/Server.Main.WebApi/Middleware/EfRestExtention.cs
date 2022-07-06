namespace Server.Main.WebApi.Middleware;

using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Server.Repository.AppDb;

public static class EfRestExtention
{
    public static RouteHandlerBuilder UseEfRest(this IEndpointRouteBuilder app) =>
        app.Map(
            "/api/{**path}",
            [TypeFilter(typeof(StatusCodeExceptionFilter))]
            async (
                AppDbContext db,
                CloudCqsOptions<EfRest.EfRestServer> cloudCqsOptions,
                IOptions<JsonOptions> jsonOptions,
                HttpRequest request,
                HttpResponse response
            ) =>
            {
                var jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
                var efrest = new EfRest.EfRestServer(db)
                {
                    CloudCqsOptions = cloudCqsOptions,
                    JsonSerializerOptions = jsonSerializerOptions,
                };
                var method = request.Method;
                using var requestStream = new StreamReader(request.Body, Encoding.UTF8);
                var body = await requestStream.ReadToEndAsync();
                var pathAndQuery = $"{request.Path}{request.QueryString}"[5..];
                var (statusCode, headers, responseBody) = await efrest.Request(
                    method,
                    pathAndQuery,
                    body
                );
                response.StatusCode = statusCode;
                foreach (var (key, value) in headers)
                {
                    response.Headers.Add(key, value);
                }

                return responseBody;
            }
        );
}
