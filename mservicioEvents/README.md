# Guía para usar el microservicio en PHP

## 1. Requisitos previos

- PHP >= 7.4
- Composer (https://getcomposer.org/)
- Servidor web (opcional, puedes usar el servidor embebido de PHP)

## 2. Instalación de dependencias

Crea un archivo `composer.json` en la raíz del microservicio con el siguiente contenido:

{
    "require": {
        "slim/slim": "^4.0",
        "slim/psr7": "^1.3"
    }
}

Luego ejecuta en la terminal:

composer install

## 3. Código base del microservicio

Crea un archivo `index.php` con el siguiente contenido de ejemplo:

<?php
require __DIR__ . '/vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

$app = AppFactory::create();


$app->run();

## 4. Ejecución del microservicio

Desde la raíz del proyecto, ejecuta:

php -S localhost:8080 index.php

## 5. Prueba

Abre tu navegador y visita:  
http://localhost:8080/eventos

Deberías ver una respuesta JSON con los eventos de ejemplo.

---

**Nota:**  
Adapta las rutas y lógica según las necesidades de tu microservicio.