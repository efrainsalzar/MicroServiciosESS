<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/test-db', function ()
{
    try {
        \DB::connection()->getPdo();
        return response()->json(['message' => 'Conexión exitosa a la base de datos']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'No se pudo conectar a la base de datos: ' . $e->getMessage()], 500);
    }
});


$router->get('/events', 'EventController@index');


$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->post('/events', 'EventController@store');
    $router->put('/events/{id}', 'EventController@update');
    $router->patch('/events/{id}', 'EventController@update');
    $router->delete('/events/{id}', 'EventController@destroy');
});
