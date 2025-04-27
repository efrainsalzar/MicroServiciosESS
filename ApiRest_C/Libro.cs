namespace LibrosAPI.Models
{
    public class Libro
    {
        public int id { get; set; }
        public string nombre { get; set; } = string.Empty;
        public string autor { get; set; } = string.Empty;
        public string descripcion { get; set; } = string.Empty;
        public DateTime fecha_publicacion { get; set; }
    }
}