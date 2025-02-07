import axiosInstance from "@/config/axiosInstance";
import { IUser } from "@/shared/interfaces/IUser";

// Obtener lista de usuarios con filtro opcional por rol
export const getUsersService = async (role?: string) => {
  try {
    const response = await axiosInstance.get("/users", {
      params: role ? { role } : {},
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios");
  }
};

export const getUserDetailsService = async (userId: string) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("ID de usuario no válido");
  }

  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener detalles del usuario:", error);
    throw new Error("No se pudieron obtener los detalles del usuario");
  }
};

  
// Suspender un usuario por ID
export const suspendUserService = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/users/${userId}/suspend`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al suspender usuario:", error);
    throw new Error("No se pudo suspender el usuario");
  }
};

// Eliminar un usuario por ID
export const deleteUserService = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw new Error("No se pudo eliminar el usuario");
  }
};

// Actualizar datos de un usuario por ID
export const updateUserService = async (userId: string, userData: Partial<IUser>) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    throw new Error("No se pudo actualizar el usuario");
  }
};
