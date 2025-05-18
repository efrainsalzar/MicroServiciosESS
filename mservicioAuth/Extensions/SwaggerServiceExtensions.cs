using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace mservicioAuth.Extensions
{
    public static class SwaggerServiceExtensions
    {
        
        /// Agrega y configura Swagger con soporte para autenticación JWT Bearer.
        public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                // Define la documentación básica de la API
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "AuthService", Version = "v1" });

                // Configura el esquema de seguridad JWT Bearer
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: 'Bearer {token}'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                // Requiere el esquema Bearer para acceder a los endpoints protegidos
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            return services;
        }
    }
}