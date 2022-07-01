namespace Server.EntoryPoint.WebApi.Middleware;

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
                                "Terminated: {Class}[{Description}] param={Param}, exception={Exception} in {TotalMilliseconds}ms",
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
