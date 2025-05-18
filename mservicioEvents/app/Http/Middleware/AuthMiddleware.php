<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function handle($request, Closure $next)
    {
        // Obtiene el header Authorization de la petición
        $authorization = $request->header('Authorization');

        // Verifica que el header exista y tenga el formato Bearer {token}
        if (!$authorization || !preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            return response()->json(['error' => 'Token no proporcionado o formato inválido'], 401);
        }

        $token = $matches[1];
        $secretKey = env('JWT_SECRET');

        try {
            // Decodifica y valida el token JWT usando la clave secreta
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

            // Valida opcionalmente el issuer del token
            if ($decoded->iss !== 'AuthService') {
                return response()->json(['error' => 'Issuer inválido'], 401);
            }

            // Agrega la información del usuario autenticado al request
            $request->auth = $decoded;

        } catch (\Exception $e) {
            // Si el token es inválido o hay error, retorna 401 con el mensaje
            return response()->json(['error' => 'Token inválido: ' . $e->getMessage()], 401);
        }

        // Continúa con la siguiente acción del middleware o controlador
        return $next($request);
    }
}