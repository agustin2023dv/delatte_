import { IUser } from '@delatte/shared';
import axiosInstance from '@/config/axiosInstance';

// **Función para obtener datos de usuario**
export const fetchUserDataService = async () => {
  try {
    const response = await axiosInstance.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error en fetchUserDataService:", error);
    throw new Error("Error al obtener los datos del usuario");
  }
};

// **Función para cambiar datos de usuario**
export const updateUserDataService = async (updatedData: Partial<IUser>) => {
  try {
    const response = await axiosInstance.put("/profile", updatedData);
    return response.data;
  } catch (error) {
    console.error("Error en updateUserDataService:", error);
    throw new Error("Error al actualizar los datos del usuario");
  }
};