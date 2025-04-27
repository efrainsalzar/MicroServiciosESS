using Microsoft.EntityFrameworkCore;
using LibrosAPI.Models;

namespace LibrosAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Libro> Libros { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Libro>().ToTable("libro");
            
            // Configurar nombres de columnas específicos si son diferentes
            modelBuilder.Entity<Libro>()
                .Property(l => l.id).HasColumnName("id");
            modelBuilder.Entity<Libro>()
                .Property(l => l.nombre).HasColumnName("nombre");
            modelBuilder.Entity<Libro>()
                .Property(l => l.autor).HasColumnName("autor");
            modelBuilder.Entity<Libro>()
                .Property(l => l.descripcion).HasColumnName("descripcion");
            modelBuilder.Entity<Libro>()
                .Property(l => l.fecha_publicacion).HasColumnName("fecha_publicacion");
        }
    }
}