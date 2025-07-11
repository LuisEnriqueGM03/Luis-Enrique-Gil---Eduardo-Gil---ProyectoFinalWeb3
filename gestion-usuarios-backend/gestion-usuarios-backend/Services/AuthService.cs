using gestion_usuarios_backend.DTOs;
using gestion_usuarios_backend.Models;
using gestion_usuarios_backend.Data;
using gestion_usuarios_backend.Helpers;
using BCrypt.Net;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace gestion_usuarios_backend.Services
{
    public interface IAuthService
    {
        string Login(LoginDTO loginDto);
        Usuario Register(RegisterDTO registerDto);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public string Login(LoginDTO loginDto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == loginDto.Email);
            if (usuario == null)
                return null;

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.Password))
                return null;

            var secret = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            return JwtHelper.GenerateJwtToken(usuario, secret, issuer, audience);
        }

        public Usuario Register(RegisterDTO registerDto)
        {
            if (_context.Usuarios.Any(u => u.Email == registerDto.Email))
                return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            if (!Enum.TryParse<Models.Rol>(registerDto.Rol, out var rolEnum))
                return null;

            var usuario = new Usuario
            {
                Nombre = registerDto.Nombre,
                Email = registerDto.Email,
                Password = passwordHash,
                Rol = rolEnum
            };

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
            return usuario;
        }
    }
} 