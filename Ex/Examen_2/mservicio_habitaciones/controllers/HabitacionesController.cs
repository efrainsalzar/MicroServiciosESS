using habitacion_service.Models;
using habitacion_service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace habitacion_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Protege todos los endpoints
    public class HabitacionesController : ControllerBase
    {
        private readonly HabitacionService _habitacionService;

        public HabitacionesController(HabitacionService habitacionService)
        {
            _habitacionService = habitacionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Habitacion>>> Get() =>
            await _habitacionService.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Habitacion>> Get(string id)
        {
            var habitacion = await _habitacionService.GetByIdAsync(id);
            if (habitacion == null) return NotFound();
            return habitacion;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Habitacion habitacion)
        {
            await _habitacionService.CreateAsync(habitacion);
            return CreatedAtAction(nameof(Get), new { id = habitacion.Id }, habitacion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Habitacion habitacion)
        {
            var existing = await _habitacionService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            habitacion.Id = id;
            await _habitacionService.UpdateAsync(id, habitacion);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var habitacion = await _habitacionService.GetByIdAsync(id);
            if (habitacion == null) return NotFound();

            await _habitacionService.DeleteAsync(id);
            return NoContent();
        }
    }
}
