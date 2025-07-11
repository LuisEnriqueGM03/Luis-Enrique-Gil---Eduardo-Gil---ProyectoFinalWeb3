using Microsoft.AspNetCore.Mvc;
using gestion_usuarios_backend.DTOs;
using gestion_usuarios_backend.Services;

namespace gestion_usuarios_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginDto)
        {
            var token = _authService.Login(loginDto);
            if (token == null) return Unauthorized();
            return Ok(new { token });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDTO registerDto)
        {
            var usuario = _authService.Register(registerDto);
            if (usuario == null) return BadRequest();
            return Ok(usuario);
        }
    }
} 