import axiosInstance from "@/config/axiosInstance";
import { IReservation } from "@delatte/shared/interfaces";

// **Obtener reservas de un restaurante **
export const fetchRestaurantReservationsService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/reservations/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reservas del restaurante:", error);
    throw error;
  }
};
