<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventModel extends Model
{
    protected $table = 'events';

    // Coincidir con los nombres reales de las columnas en la tabla
    protected $fillable = ['name', 'date', 'location', 'capacity', 'price'];

    // created_at y updated_at están presentes, así que mantenemos timestamps habilitados
    public $timestamps = true;
}
