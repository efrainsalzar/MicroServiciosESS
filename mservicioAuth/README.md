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