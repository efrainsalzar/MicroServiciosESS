<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Carga las variables de entorno desde el archivo .env
(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

// Establece la zona horaria por defecto
date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

/*
|--------------------------------------------------------------------------
| Crear la Aplicación
|--------------------------------------------------------------------------
|
| Aquí se crea la instancia principal de la aplicación Lumen.
|
*/

$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

// Habilita facades como DB, Cache, etc.
$app->withFacades();

// Habilita Eloquent ORM para el manejo de modelos y base de datos
$app->withEloquent();

// Carga la configuración de la base de datos
$app->configure('database');

// Registra el middleware de autenticación JWT
$app->routeMiddleware([
    'auth' => App\Http\Middleware\AuthMiddleware::class,
]);

// Registra las rutas de la aplicación
$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__ . '/../routes/web.php';
});

return $app;