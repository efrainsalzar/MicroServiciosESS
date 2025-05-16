// modelo que recibe las credenciales
namespace mservicioAuth.Models;

//clase 
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
