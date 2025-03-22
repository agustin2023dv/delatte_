import axios from "axios";
import { API_URL } from "./apiConfig";
import { attachAuthToken, handleAuthError } from "./authInterceptor";
import { handleGlobalErrors } from "./errorInterceptor";

/**
 * 🔧 Instancia de Axios personalizada para toda la app.
 * - Configura la baseURL según el entorno (web o mobile).
 * - Aplica headers comunes.
 * - Aplica timeout para evitar cuelgues eternos.
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de espera máxima por petición
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🛡️ Interceptor de request
 * - Adjunta automáticamente el token JWT si existe.
 */
axiosInstance.interceptors.request.use(attachAuthToken);

/**
 * 🚨 Interceptor de response
 * - Si hay error 401 → ejecuta lógica de logout/redirección.
 * - Si hay otros errores (403, 500, etc.) → se manejan globalmente.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    await handleAuthError(error); // Auth errors (401)
    return await handleGlobalErrors(error); // Global errors
  }
);

export default axiosInstance;