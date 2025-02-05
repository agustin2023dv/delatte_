import { getItem, removeItem } from "@/storage/storage";
import axios from "axios";
import { router } from "expo-router";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === 'web'
    ? process.env.EXPO_PUBLIC_API_URL_WEB
    : process.env.EXPO_PUBLIC_API_URL_MOBILE;
    console.log("📌 API_URL en axiosInstance:", API_URL);
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// **Interceptor para manejar errores 401**
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expirado. Cerrando sesión...");
      await removeItem("token"); // Eliminar token del storage
      router.replace("/(auth)/login"); // Redirigir al usuario al login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
