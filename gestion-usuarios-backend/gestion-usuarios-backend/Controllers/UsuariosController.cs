using Microsoft.AspNetCore.Mvc;
using gestion_usuarios_backend.Models;
using gestion_usuarios_backend.Services;
using gestion_usuarios_backend.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace gestion_usuarios_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdministrador")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_usuarioService.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var usuario = _usuarioService.GetById(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        [HttpPost]
        public IActionResult Create([FromBody] RegisterDTO registerDto)
        {
      
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            if (!Enum.TryParse<Rol>(registerDto.Rol, out var rolEnum))
                return BadRequest(new { success = false, message = "Rol inválido" });

            var usuario = new Usuario
            {
                Nombre = registerDto.Nombre,
                Email = registerDto.Email,
                Password = passwordHash,
                Rol = rolEnum
            };

            var created = _usuarioService.Create(usuario);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Usuario usuario)
        {
            var updated = _usuarioService.Update(id, usuario);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _usuarioService.Delete(id);
            return NoContent();
        }
    }
} 