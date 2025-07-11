using System.ComponentModel.DataAnnotations;

namespace gestion_usuarios_backend.Models
{
    public enum Rol
    {
        SuperAdministrador,
        adminElecciones,
        juradoElecciones,
        adminPadron
    }

    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Email { get; set; }
        public string? Password { get; set; }
        [Required]
        public Rol Rol { get; set; }
    }
} 