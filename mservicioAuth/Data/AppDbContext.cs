// Usado para trabajar con Entity Framework Core.
using Microsoft.EntityFrameworkCore;
using mservicioAuth.Models; // Importa el modelo de usuario

namespace mservicioAuth.Data
{
    // Contexto de base de datos principal para la aplicación.
    public class AppDbContext : DbContext
    {
        // Constructor que recibe las opciones de configuración del contexto.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // Representa la tabla de usuarios en la base de datos.
        public DbSet<User> Users { get; set; }
    }
}