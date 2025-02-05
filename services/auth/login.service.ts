import axiosInstance from "@/config/axiosInstance";
import { setItem } from "@/storage/storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// **Servicio para iniciar sesión como Manager**
export const loginManagerService = async (email: string, password: string) => {
  return await loginUser("/auth/login-manager", email, password, "Manager");
};

// **Servicio para iniciar sesión como Customer**
export const loginCustomerService = async (email: string, password: string) => {
  return await loginUser("/auth/login-customer", email, password, "Customer");
};

// **Función Genérica para el Login**
const loginUser = async (endpoint: string, email: string, password: string, userType: string) => {
  try {
    const response = await axiosInstance.post(endpoint, { email, password });
    const { token, user } = response.data;

    const decodedUser = jwtDecode(token);

    // Guardar datos en el almacenamiento seguro
    await setItem("token", token);
    await setItem("userRole", user.role);
    await setItem("userEmail", user.email);

    console.log(`✅ Usuario ${userType} autenticado correctamente`);
    return { user: decodedUser, token };
  } catch (error) {
    console.error(`❌ Error en login${userType}Service:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Error al iniciar sesión como ${userType}`
        : "Error inesperado"
    );
  }
};
