using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace habitacion_service.Models
{
    public class Habitacion
    {
        public string Id { get; set; }
        public int NumeroHabitacion { get; set; }
        public string TipoHabitacion { get; set; } // individual, doble, suite
        public decimal PrecioPorNoche { get; set; }
        public bool Estado { get; set; }
        public string Descripcion { get; set; }
    }
}
