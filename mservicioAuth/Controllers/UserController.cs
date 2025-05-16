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

        // GET: api/User
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // POST: api/user/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {

            user.Role = "user";

            
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("El correo ya está registrado.");


            if (_context.Users.Any(u => u.Username == user.Username))
                return BadRequest("El nombre de usuario ya esta en uso");

            // Hashea la contraseña antes de guardarla
            user.Password_Hash = BCrypt.Net.BCrypt.HashPassword(user.Password_Hash);
            user.Created_At = DateTime.UtcNow;

            // Convierte el rol a minúsculas
            user.Role = user.Role.ToLower();

            // Agrega a la base de datos
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Retorna mensaje de éxito
            return Ok(new
            {
                mensaje = "Usuario creado correctamente.",
                user.Id,
                user.Username,
                user.Email,
                user.Role
            });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] User adminUser)
        {
            adminUser.Role = "admin";

            if (_context.Users.Any(u => u.Email == adminUser.Email))
                return BadRequest("El correo ya está registrado.");

            if (_context.Users.Any(u => u.Username == adminUser.Username))
                return BadRequest("El nombre de usuario ya está en uso");

            adminUser.Password_Hash = BCrypt.Net.BCrypt.HashPassword(adminUser.Password_Hash);
            adminUser.Created_At = DateTime.UtcNow;

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
