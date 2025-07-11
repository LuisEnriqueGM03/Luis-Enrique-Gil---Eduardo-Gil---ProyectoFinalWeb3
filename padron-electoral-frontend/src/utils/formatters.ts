/**
 * Formatea una fecha para mostrar en formato local
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleDateString("es-BO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Fecha inválida";
  }
};

/**
 * Formatea un número de CI
 */
export const formatCI = (ci: string): string => {
  if (!ci) return "";

  // Remover espacios y caracteres especiales
  const cleanCI = ci.replace(/\D/g, "");

  // Formatear con guiones (ejemplo: 1234567 -> 1.234.567)
  if (cleanCI.length >= 7) {
    return cleanCI.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
  }

  return cleanCI;
};

/**
 * Trunca texto largo
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
