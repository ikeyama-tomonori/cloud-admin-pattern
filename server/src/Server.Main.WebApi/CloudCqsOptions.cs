namespace Server.Main.WebApi;

using CloudCqs;

public class CloudCqsOptions<T> : CloudCqsOptions
{
    public CloudCqsOptions(ILogger<T> logger)
    {
        this.RepositoryExecuted = p =>
            logger.LogInformation(
                "Executed: {Repository} request={Request}, response={Response} in {TotalMilliseconds}ms",
                p.RepositoryType.Name,
                p.Request,
                p.Response,
                p.TimeSpan.TotalMilliseconds
            );
        this.RepositoryTerminated = p =>
            logger.LogWarning(
                "Terminated: {Repository} request={Request}, exception={Exception} in {TotalMilliseconds}ms",
                p.RepositoryType.Name,
                p.Request,
                p.Exception,
                p.TimeSpan.TotalMilliseconds
            );
        this.FunctionExecuted = p =>
            logger.LogInformation(
                "Executed: {Repository}[{Description}] param={Param}, result={Result} in {TotalMilliseconds}ms",
                p.RepositoryType.Name,
                p.Description,
                p.Param,
                p.Result,
                p.TimeSpan.TotalMilliseconds
            );
        this.FunctionTerminated = p =>
            logger.LogWarning(
                "Terminated: {Repository}[{Description}] param={Param}, exception={Exception} in {TotalMilliseconds}ms",
                p.RepositoryType.Name,
                p.Description,
                p.Param,
                p.Exception,
                p.TimeSpan.TotalMilliseconds
            );
    }
}
