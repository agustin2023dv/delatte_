import axiosInstance from "@/config/axios/axiosInstance";
import { setItem } from "@/storage/storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


// **Función Genérica para el Login**
export const loginUser = async (endpoint: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post(endpoint, { email, password });
    const { token, user } = response.data;

    const decodedUser = jwtDecode(token);

    // Guardar datos en el almacenamiento seguro
    await setItem("token", token);
    await setItem("userRole", user.role);
    await setItem("userEmail", user.email);

    console.log(`✅ Usuario  autenticado correctamente`);
    return { user: decodedUser, token };
  } catch (error) {
    console.error(`❌ Error en loginService:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Error al iniciar sesión`
        : "Error inesperado"
    );
  }
};
