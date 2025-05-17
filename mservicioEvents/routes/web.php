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

$router->get('/test-db', 'EventController@testConnection');


$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/events', 'EventController@index');
    $router->post('/events', 'EventController@store');
    $router->put('/events/{id}', 'EventController@update');
    $router->patch('/events/{id}', 'EventController@update');
    $router->delete('/events/{id}', 'EventController@destroy');
});
