namespace gestion_usuarios_backend.DTOs
{
    public class RegisterDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Rol { get; set; } // Se espera un string que coincida con el enum
    }
} 