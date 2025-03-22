import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL_WEB
    : process.env.EXPO_PUBLIC_API_URL_MOBILE;

if (!API_URL) {
  throw new Error("❌ API_URL no está definida en el entorno.");
}
