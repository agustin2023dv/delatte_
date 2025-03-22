import { AxiosError } from "axios";

/**
 * 🔍 Maneja errores HTTP que no son de autenticación (401).
 * Centraliza el manejo de errores para mejorar UX y debugging.
 */
export const handleGlobalErrors = async (error: AxiosError): Promise<never> => {
  const status = error.response?.status;

  switch (status) {
    case 400:
      console.warn("⚠️ Solicitud incorrecta. Verifica los datos enviados.");
      break;
    case 403:
      console.warn("⛔ Acceso denegado. No tienes permisos.");
      break;
    case 404:
      console.warn("🔎 Recurso no encontrado.");
      break;
    case 408:
      console.warn("⏰ Tiempo de espera agotado. Intenta nuevamente.");
      break;
    case 429:
      console.warn("🚫 Demasiadas peticiones. Espera un momento.");
      break;
    case 500:
      console.error("💥 Error interno del servidor. Intenta más tarde.");
      break;
    case 503:
      console.warn("🛠️ Servicio no disponible. Estamos trabajando en ello.");
      break;
    default:
      console.error("❗ Error inesperado:", error.message);
      break;
  }

  return Promise.reject(error);
};