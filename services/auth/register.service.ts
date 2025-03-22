import axiosInstance from "@/config/axios/axiosInstance";
import { isAxiosError } from "axios";

// **Función para registrar un nuevo usuario**
export const registerUserService = async (
  nombre: string,
  apellido: string,
  email: string,
  password: string
) => {
  try {
   
    const response = await axiosInstance.post("/auth/register", {
      nombre,
      apellido,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error en registerUserService:", error);
    throw new Error(
      isAxiosError(error)
        ? error.response?.data?.message || "Error al registrar el usuario"
        : "Error desconocido"
    );
  }
};
