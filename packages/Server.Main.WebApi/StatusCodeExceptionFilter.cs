namespace Server.Main.WebApi;

using CloudCqs;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class StatusCodeExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is StatusCodeException e)
        {
            var errors = e.ValidationResult
                is { ErrorMessage: string, MemberNames: IEnumerable<string> }
                ? new Dictionary<string, string[]>
                {
                    [e.ValidationResult.ErrorMessage] = e.ValidationResult.MemberNames.ToArray(),
                }
                : new Dictionary<string, string[]>();
            var obj = new ValidationProblemDetails(errors);
            context.Result = new ObjectResult(obj) { StatusCode = (int)e.HttpStatusCode, };
        }
    }
}
