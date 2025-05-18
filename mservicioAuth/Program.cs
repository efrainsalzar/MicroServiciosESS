using mservicioAuth.Extensions;
using mservicioAuth.Services;

// Crea el builder para configurar la aplicación web
var builder = WebApplication.CreateBuilder(args);

// Configura la base de datos, autenticación y Swagger usando métodos de extensión
builder.Services.AddCustomDatabase(builder.Configuration);
builder.Services.AddCustomAuthentication(builder.Configuration);
builder.Services.AddCustomSwagger();

// Agrega los controladores y servicios necesarios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<AuthService>();

// Construye la aplicación
var app = builder.Build();

// Habilita Swagger para documentación y pruebas de la API
app.UseSwagger();
app.UseSwaggerUI();

// Habilita la autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Mapea los controladores a las rutas correspondientes
app.MapControllers();

// Inicia la aplicación
app.Run();