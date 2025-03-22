import axiosInstance from '@/config/axios/axiosInstance';

    export const getUserFavoritesService = async () => {
      try {
        const response = await axiosInstance.get("/favorites");
        return response.data.favorites;
      } catch (error) {
        console.error("Error en getUserFavoritesService:", error);
        throw new Error("Error al obtener los favoritos del usuario");
      }
    };

// **Servicio para agregar restaurante a favoritos**
export const addFavoriteRestaurantService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.post("/favorites", { restaurantId });
    return response.data;
  } catch (error) {
    console.error("Error en addFavoriteRestaurantService:", error);
    throw new Error("Error al agregar restaurante a favoritos");
  }
};

// **Servicio para eliminar restaurante de favoritos**
export const removeFavoriteRestaurantService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.delete("/favorites", {
      data: { restaurantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error en removeFavoriteRestaurantService:", error);
    throw new Error("Error al eliminar restaurante de favoritos");
  }
};
