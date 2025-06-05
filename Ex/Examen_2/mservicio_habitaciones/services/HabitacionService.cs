using habitacion_service.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace habitacion_service.Services
{
    public class HabitacionService
    {
        private readonly IMongoCollection<Habitacion> _habitaciones;

        public HabitacionService(IOptions<MongoDBSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoSettings.Value.Database);
            _habitaciones = database.GetCollection<Habitacion>(mongoSettings.Value.HabitacionesCollection);
        }
        public async Task<List<Habitacion>> GetAllAsync() =>
            await _habitaciones.Find(_ => true).ToListAsync();

        public async Task<Habitacion?> GetByIdAsync(string id) =>
            await _habitaciones.Find(h => h.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Habitacion habitacion) =>
            await _habitaciones.InsertOneAsync(habitacion);

        public async Task UpdateAsync(string id, Habitacion habitacion) =>
            await _habitaciones.ReplaceOneAsync(h => h.Id == id, habitacion);

        public async Task DeleteAsync(string id) =>
            await _habitaciones.DeleteOneAsync(h => h.Id == id);
    }
}
