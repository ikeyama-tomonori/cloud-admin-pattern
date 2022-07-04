using Server.Main.WebApi.Middleware;
using Server.Main.WebApi.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAppDbContext();

var app = builder.Build();

app.UseHttpLogging();
app.UseSwaggerUI();
app.UseEfRestSwagger();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.UseEfRest();

app.Run();
