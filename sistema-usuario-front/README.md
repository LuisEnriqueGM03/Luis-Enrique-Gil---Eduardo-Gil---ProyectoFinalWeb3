# Sistema de Gestión de Usuarios - Frontend

Este es el frontend del Sistema de Gestión de Usuarios y Accesos, desarrollado con React, TypeScript y Tailwind CSS.

## Características

- **Autenticación segura**: Solo permite acceso a usuarios con rol "SuperAdministrador"
- **CRUD completo de usuarios**: Crear, leer, actualizar y eliminar usuarios
- **CRUD completo de roles**: Gestión de roles del sistema
- **Asignación de roles únicos**: Cada usuario puede tener solo un rol
- **Interfaz moderna**: Diseño profesional con Tailwind CSS
- **Protección de rutas**: Todas las rutas están protegidas excepto el login
- **Gestión de perfil**: Los usuarios pueden editar su información personal

## Roles del Sistema

- **Super Administrador**: Acceso completo al sistema
- **Administrador de Elecciones**: Administración del sistema electoral
- **Jurado Electoral**: Participación en procesos electorales
- **Administrador del Padrón**: Administración del padrón electoral

## Tecnologías Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Fetch API para comunicación con backend

## Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
├── hooks/          # Hooks personalizados
├── models/         # Modelos de datos
│   └── dto/        # Data Transfer Objects
├── navigation/     # Configuración de rutas
├── pages/          # Páginas principales
├── redux/          # Estado global (preparado para Redux)
├── services/       # Servicios de API
└── index.css       # Estilos globales
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Crear archivo .env en la raíz del proyecto
REACT_APP_API_URL=http://localhost:8000/api
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta los tests
- `npm run eject`: Expone la configuración de build

## Funcionalidades Principales

### Autenticación
- Login seguro con validación de rol SuperAdministrador
- Gestión de tokens JWT
- Protección automática de rutas

### Gestión de Usuarios
- Lista de usuarios con paginación
- Creación de nuevos usuarios
- Edición de información de usuarios
- Activación/desactivación de usuarios
- Eliminación de usuarios
- Asignación de roles únicos

### Gestión de Roles
- Lista de roles disponibles
- Creación de nuevos roles
- Edición de roles existentes
- Activación/desactivación de roles
- Eliminación de roles

### Perfil de Usuario
- Visualización de información personal
- Edición de datos del perfil
- Cambio de contraseña
- Historial de accesos

## Configuración del Backend

Este frontend está diseñado para trabajar con un backend que exponga las siguientes rutas:

- `POST /api/auth/login` - Autenticación
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
