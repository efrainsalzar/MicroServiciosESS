<?php

require_once __DIR__ . '/../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

/*
Create The Application
*/

$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

// Habilita facades (como DB, Cache, etc)
$app->withFacades();

// Habilita Eloquent ORM
$app->withEloquent();
// Carga configuración de base de datos
$app->configure('database');


$app->routeMiddleware([
    'auth' => App\Http\Middleware\AuthMiddleware::class,
]);



$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__ . '/../routes/web.php';
});

return $app;
