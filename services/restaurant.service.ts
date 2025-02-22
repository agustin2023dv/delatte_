import axiosInstance from "@/config/axiosInstance";
import { IRestaurant,IUser } from "@delatte/shared/interfaces";

// **Crear manager y restaurante**
export const createRestaurantAndManagerService = async (
  restaurantData: Partial<IRestaurant>,
  managerData: Partial<IUser>
) => {
  try {
    const response = await axiosInstance.post("/restaurantes/register-restaurant", {
      restaurant: restaurantData,
      manager: managerData,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear restaurante y manager:", error);
    throw error;
  }
};

// **Obtener todos los restaurantes**
export const getAllRestaurantsService = async () => {
  try {
    const response = await axiosInstance.get("/restaurantes");
    return response.data;
  } catch (error) {
    console.error("Error al obtener restaurantes:", error);
    throw error;
  }
};

// **Obtener restaurante por ID**
export const getRestaurantByIdService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener restaurante por ID:", error);
    throw error;
  }
};

// **Actualizar restaurante**
export const updateRestaurantService = async (
  restaurantId: string,
  updateData: Partial<IRestaurant>
) => {
  try {
    const response = await axiosInstance.put(`/restaurantes/${restaurantId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el restaurante:", error);
    throw new Error("No se pudo actualizar el restaurante");
  }
};

// **Obtener restaurantes gestionados por un manager**
export const getRestaurantsByManagerIdService = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/manager/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener restaurantes del manager:", error);
    throw new Error("Error al obtener restaurantes");
  }
};

// **Obtener reviews de un restaurante**
export const getReviewsService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/${restaurantId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener reviews:", error);
    throw error;
  }
};

// **Buscar restaurantes**
export const searchRestaurantsService = async (query: string) => {
  try {
    const response = await axiosInstance.get("/restaurantes/search", { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("Error al buscar restaurantes:", error);
    throw new Error("Error al buscar restaurantes");
  }
};

// **Verificar si el usuario es manager o co-manager**
export const isUserManagerService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/${restaurantId}/is-manager`);
    return response.data.isManager;
  } catch (error) {
    console.error("Error al verificar rol del usuario:", error);
    throw new Error("Error al verificar rol del usuario");
  }
};

// **Agregar foto a la galería**
export const addPhotoToGalleryService = async (restaurantId: string, photo: File | Blob) => {
  try {
    const formData = new FormData();
    formData.append("photo", photo);

    const response = await axiosInstance.post(`/restaurantes/${restaurantId}/gallery`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error al agregar foto a la galería:", error);
    throw new Error("No se pudo agregar la foto a la galería");
  }
};

// **Eliminar foto de la galería**
export const deletePhotoFromGalleryService = async (restaurantId: string, photoUrl: string) => {
  try {
    const response = await axiosInstance.delete(`/restaurantes/${restaurantId}/gallery`, {
      data: { photoUrl },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar foto de la galería:", error);
    throw new Error("No se pudo eliminar la foto de la galería");
  }
};

// **Obtener todas las fotos de la galería**
export const getGalleryPhotosService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/${restaurantId}/gallery`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener fotos de la galería:", error);
    throw new Error("Error al obtener fotos de la galería");
  }
};

// **Obtener restaurantes cercanos**
export const getNearbyRestaurantsService = async (lat: number, lng: number, radius: number) => {
  try {
    const response = await axiosInstance.get(`/restaurantes/nearby/${lng}/${lat}/${radius}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo restaurantes cercanos:", error);
    throw error;
  }
};
