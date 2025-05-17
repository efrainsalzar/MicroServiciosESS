<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function handle($request, Closure $next)
    {
        $authorization = $request->header('Authorization');

        if (!$authorization || !preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            return response()->json(['error' => 'Token no proporcionado o formato inválido'], 401);
        }

        $token = $matches[1];
        $secretKey = env('JWT_SECRET');

        try {
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

            // Opcional: validar el issuer
            if ($decoded->iss !== 'AuthService') {
                return response()->json(['error' => 'Issuer inválido'], 401);
            }

            // Puedes agregar info del usuario al request para usarla en controladores
            $request->auth = $decoded;

        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido: ' . $e->getMessage()], 401);
        }

        return $next($request);
    }
}
