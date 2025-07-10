export const MESSAGES = {
  // Mensajes de éxito
  SUCCESS: {
    VOTANTE_CREATED: "Votante registrado exitosamente",
    VOTANTE_UPDATED: "Votante actualizado exitosamente",
    VOTANTE_DELETED: "Votante eliminado exitosamente",
    RECINTO_CREATED: "Recinto registrado exitosamente",
    RECINTO_UPDATED: "Recinto actualizado exitosamente",
    RECINTO_DELETED: "Recinto eliminado exitosamente",
    LOGIN_SUCCESS: "Inicio de sesión exitoso",
  },

  // Mensajes de error
  ERROR: {
    GENERIC: "Ha ocurrido un error inesperado",
    NETWORK: "Error de conexión. Verifique su conexión a internet",
    VOTANTE_LOAD: "Error al cargar la lista de votantes",
    VOTANTE_CREATE: "Error al registrar el votante",
    VOTANTE_UPDATE: "Error al actualizar el votante",
    VOTANTE_DELETE: "Error al eliminar el votante",
    RECINTO_LOAD: "Error al cargar recintos",
    RECINTO_CREATE: "Error al registrar el recinto",
    RECINTO_UPDATE: "Error al actualizar el recinto",
    RECINTO_DELETE: "Error al eliminar el recinto",
    LOGIN_FAILED: "Credenciales inválidas",
    UNAUTHORIZED: "No tiene permisos para realizar esta acción",
    CI_EXISTS: "Ya existe un votante con este número de CI",
    INVALID_FILE: "Archivo inválido",
    PADRON_QUERY: "Error al consultar el padrón electoral",
  },

  // Mensajes de confirmación
  CONFIRM: {
    DELETE_VOTANTE: "¿Estás seguro de que deseas eliminar este votante?",
    DELETE_RECINTO: "¿Estás seguro de que deseas eliminar este recinto?",
    LOGOUT: "¿Estás seguro de que deseas cerrar sesión?",
  },

  // Mensajes informativos
  INFO: {
    NO_VOTANTES: "No hay votantes registrados",
    NO_RECINTOS: "No hay recintos registrados",
    NO_SEARCH_RESULTS: "No se encontraron resultados para la búsqueda",
    LOADING: "Cargando...",
    SAVING: "Guardando...",
    DELETING: "Eliminando...",
    UPLOADING: "Subiendo archivos...",
  },

  // Placeholders
  PLACEHOLDER: {
    SEARCH: "Buscar por nombre, CI o recinto...",
    CI: "Ej: 12345678",
    NAME: "Ej: Juan Pérez García",
    ADDRESS: "Dirección completa del votante",
    RECINTO_NAME: "Ej: Unidad Educativa Central",
    RECINTO_LOCATION: "Ej: Av. Principal #123, Zona Centro",
  },
};
