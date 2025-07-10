/**
 * Valida un número de CI boliviano
 */
export const validateCI = (ci: string): boolean => {
  if (!ci) return false;

  // Remover espacios y caracteres especiales
  const cleanCI = ci.replace(/\D/g, "");

  // CI debe tener entre 6 y 8 dígitos
  if (cleanCI.length < 6 || cleanCI.length > 8) {
    return false;
  }

  // Verificar que sea solo números
  return /^\d+$/.test(cleanCI);
};

/**
 * Valida un nombre completo
 */
export const validateName = (name: string): boolean => {
  if (!name || name.trim().length < 2) return false;

  // Permitir solo letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  return nameRegex.test(name.trim());
};

/**
 * Valida una dirección
 */
export const validateAddress = (address: string): boolean => {
  if (!address || address.trim().length < 5) return false;
  return true;
};

/**
 * Valida un archivo de imagen
 */
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: "No se ha seleccionado ningún archivo" };
  }

  // Verificar tipo de archivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Solo se permiten archivos JPG, PNG o GIF",
    };
  }

  // Verificar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: "El archivo no puede ser mayor a 5MB" };
  }

  return { isValid: true };
};

/**
 * Obtiene el mensaje de error para un campo específico
 */
export const getFieldError = (field: string, value: any): string | null => {
  switch (field) {
    case "ci":
      return !validateCI(value)
        ? "CI inválido (debe tener entre 6 y 8 dígitos)"
        : null;
    case "nombre_completo":
      return !validateName(value)
        ? "Nombre inválido (mínimo 2 caracteres, solo letras)"
        : null;
    case "direccion":
      return !validateAddress(value)
        ? "Dirección inválida (mínimo 5 caracteres)"
        : null;
    default:
      return null;
  }
};
