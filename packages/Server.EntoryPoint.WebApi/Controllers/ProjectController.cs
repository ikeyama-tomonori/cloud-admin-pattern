namespace Server.EntoryPoint.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
[TypeFilter(typeof(StatusCodeExceptionFilter))]
public class ProjectController : ControllerBase
{
    [HttpPost]
    public Model.Project Get(Model.Project data)
    {
        return data;
    }
}
