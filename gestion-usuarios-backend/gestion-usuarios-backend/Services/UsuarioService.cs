using gestion_usuarios_backend.Models;
using gestion_usuarios_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace gestion_usuarios_backend.Services
{
    public interface IUsuarioService
    {
        IEnumerable<Usuario> GetAll();
        Usuario GetById(int id);
        Usuario Create(Usuario usuario);
        Usuario Update(int id, Usuario usuario);
        void Delete(int id);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuarios.ToList();
        }

        public Usuario GetById(int id)
        {
            return _context.Usuarios.FirstOrDefault(u => u.Id == id);
        }

        public Usuario Create(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
            return usuario;
        }

        public Usuario Update(int id, Usuario usuario)
        {
            var existingUsuario = _context.Usuarios.Find(id);
            if (existingUsuario == null)
                return null;

            existingUsuario.Nombre = usuario.Nombre;
            existingUsuario.Email = usuario.Email;
            existingUsuario.Rol = usuario.Rol;

            if (!string.IsNullOrWhiteSpace(usuario.Password))
            {
                existingUsuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            }

            _context.SaveChanges();
            return existingUsuario;
        }

        public void Delete(int id)
        {
            var usuario = _context.Usuarios.Find(id);
            if (usuario != null)
            {
                _context.Usuarios.Remove(usuario);
                _context.SaveChanges();
            }
        }
    }
} 