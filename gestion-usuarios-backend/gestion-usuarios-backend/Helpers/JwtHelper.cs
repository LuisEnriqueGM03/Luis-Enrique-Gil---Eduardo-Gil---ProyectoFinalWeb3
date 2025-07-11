using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using gestion_usuarios_backend.Models;

namespace gestion_usuarios_backend.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateJwtToken(Usuario usuario, string secret, string issuer, string audience, int expireMinutes = 60)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Name, usuario.Nombre),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Role, usuario.Rol.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = issuer,
                Audience = audience
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
} 