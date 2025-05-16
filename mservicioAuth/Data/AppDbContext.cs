// para trabajar con Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// importar el modelo
using mservicioAuth.Models;

// Declaramos el namespace del contexto de datos.
namespace mservicioAuth.Data
{
    // Clase
    public class AppDbContext : DbContext
    {
        // Constructor
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        
        // EF Core mapea la entidad 'User' a una tabla.
        public DbSet<User> Users { get; set; }
    }
}
