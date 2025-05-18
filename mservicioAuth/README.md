# Documentación de Uso - Microservicio de Autenticación (C#)

## Descripción

Este microservicio proporciona funcionalidades de autenticación (login, registro, validación de tokens, etc.) para aplicaciones desarrolladas en C#. Está construido con ASP.NET Core.

---

## Requisitos Previos

- .NET 6.0 SDK o superior instalado
- Acceso a una base de datos (ej: SQL Server, PostgreSQL) si es requerido por la configuración
- Visual Studio, VS Code o cualquier editor compatible

---

## Instalación

1. **Clona el repositorio:**
    ```
    git clone <URL_DEL_REPOSITORIO>
    cd mservicioAuth
    ```

2. **Restaura los paquetes NuGet:**
    ```
    dotnet restore
    ```

3. **Configura las variables de entorno o `appsettings.json`:**
    - Establece la cadena de conexión a la base de datos.
    - Configura las claves secretas para JWT.

---

## Ejecución

1. **Compila y ejecuta el microservicio:**
    ```
    dotnet run
    ```

2. El servicio estará disponible en `https://localhost:5001` o el puerto configurado.

---

## Uso del Microservicio

### 1. Registro de Usuario

**Endpoint:** `POST /api/auth/register`

**Ejemplo de Request:**


```json
{
    "Jwt": {
        "Key": "clave-secreta-super-segura-con-mucha-y-mucha-seguridad",
        "Issuer": "AuthService"
    },
    "ConnectionStrings": {
        // Para desarrollo local:
        // "DefaultConnection": "Server=localhost;Database=mservice_users_auth;User=root;Password=;"
        // Para entorno Docker (usa el nombre del contenedor del servicio de base de datos):
        "DefaultConnection": "server=db;port=3306;database=mservice_users_auth;user=root;password=;"
    },
    "Logging": {
        "LogLevel": {
            "Default": "Information"
        }
    },
    "AllowedHosts": "*"
}
```

> **Nota:**  
> - Cambia `"server=db"` por el nombre del contenedor de tu base de datos definido en `docker-compose.yml` (por ejemplo, `db`).
> - Asegúrate de que los valores de `database`, `user` y `password` coincidan con los configurados en tu contenedor de base de datos.
> - No incluyas comentarios (`// ...`) en archivos JSON reales; son solo para referencia aquí.