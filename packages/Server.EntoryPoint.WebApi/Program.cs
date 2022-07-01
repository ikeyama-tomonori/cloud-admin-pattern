using Server.EntoryPoint.WebApi.Middleware;
using Server.EntoryPoint.WebApi.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAppDbContext(builder.Configuration);

var app = builder.Build();

app.UseAuthorization();
app.UseSwaggerUI();
app.UseEfRestSwagger();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.UseEfRest();

app.Run();
