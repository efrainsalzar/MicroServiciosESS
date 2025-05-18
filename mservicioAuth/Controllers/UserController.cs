using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mservicioAuth.Data;
using mservicioAuth.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace mservicioAuth.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor que recibe el contexto de la base de datos
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // Valida si el email o username ya existen
        private string? ValidateUser(User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
                return "El correo ya está registrado.";
            if (_context.Users.Any(u => u.Username == user.Username))
                return "El nombre de usuario ya está en uso";
            return null;
        }

        // Prepara el usuario antes de guardar
        private void PrepareUser(User user, string role)
        {
            user.Role = role.ToLower(); //rol a minusculas
            user.Password_Hash = BCrypt.Net.BCrypt.HashPassword(user.Password_Hash); 
            user.Created_At = DateTime.UtcNow; // captura la fecha antes de crear en la DB
        }

        // Obtiene todos los usuarios (solo admin)
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // Registra un nuevo usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var validationMsg = ValidateUser(user);
            if (validationMsg != null)
                return BadRequest(validationMsg);

            PrepareUser(user, "user");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Usuario creado correctamente.",
                user.Id,
                user.Username,
                user.Email,
                user.Role
            });
        }

        // Crea un usuario administrador (solo admin)
        [Authorize(Roles = "admin")]
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] User adminUser)
        {
            var validationMsg = ValidateUser(adminUser);
            if (validationMsg != null)
                return BadRequest(validationMsg);

            PrepareUser(adminUser, "admin");

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Usuario administrador creado correctamente.",
                adminUser.Id,
                adminUser.Username,
                adminUser.Email,
                adminUser.Role
            });
        }
    }
}