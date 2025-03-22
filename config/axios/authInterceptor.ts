import { getItem, removeItem } from "@/storage/storage";
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";

/**
 * Añade token JWT a cada request.
 */
export const attachAuthToken = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const token = await getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

/**
 * Maneja respuestas 401 (token expirado, usuario no autenticado).
 */
export const handleAuthError = async (error: any): Promise<AxiosResponse> => {
  if (error.response?.status === 401) {
    console.warn("🔒 Token expirado o inválido. Cerrando sesión...");
    await removeItem("token");
    router.replace("/(auth)/login");
  }
  return Promise.reject(error);
};
