using mservicioAuth.Extensions;
using mservicioAuth.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCustomDatabase(builder.Configuration);
builder.Services.AddCustomAuthentication(builder.Configuration);
builder.Services.AddCustomSwagger();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<AuthService>();


var app = builder.Build();


//
app.UseSwagger();
app.UseSwaggerUI();

//middle
app.UseAuthentication();
app.UseAuthorization();

//mapea
app.MapControllers();

app.Run();
