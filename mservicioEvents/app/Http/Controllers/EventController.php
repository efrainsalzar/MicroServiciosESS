<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventModel;

class EventController extends Controller
{
    // Verifica la conexión a la base de datos
    public function testConnection()
    {
        try {
            \DB::connection()->getPdo();
            return response()->json(['message' => 'Conexión a la base de datos exitosa.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No se pudo conectar a la base de datos.', 'error' => $e->getMessage()], 500);
        }
    }

    // Obtener todos los eventos
    public function index()
    {
        return response()->json(EventModel::all());
    }

    // Crear un nuevo evento
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'capacity' => 'required|integer',
            'price' => 'required|numeric'
        ]);

        $event = EventModel::create($request->all());

        return response()->json($event, 201);
    }

    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $event = EventModel::find($id);

        if (!$event) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $event->update($request->all());

        return response()->json($event);
    }

    // Eliminar un evento
    public function destroy($id)
    {
        $event = EventModel::find($id);

        if (!$event) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Evento eliminado']);
    }
}
