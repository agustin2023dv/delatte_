import axiosInstance from "@/config/axiosInstance";
import { IReservation } from "@delatte/shared/interfaces";

// **Obtener reservas del usuario autenticado (Customer)**
export const fetchUserReservationsService = async () => {
  try {
    const response = await axiosInstance.get("/reservations");
    return response.data; 
  } catch (error) {
    console.error("❌ Error al obtener las reservas del usuario:", error);
    throw error;
  }
};

// **Crear una nueva reserva**
export const createReservationService = async (
  reservationData: {
    restauranteId: string;
    fecha: string;
    cantidadPersonas: number;
    pedidosEspeciales?: string;
  }
): Promise<void> => {
  try {
    const response = await axiosInstance.post("/reservations", reservationData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la reserva:", error);
    throw error;
  }
};

// **Cancelar una reserva**
export const cancelReservationService = async (reservationId: string)=> {
  try {
    const response = await axiosInstance.put(`/reservations/${reservationId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al cancelar la reserva:", error);
    throw error;
  }
};

// **Modificar una reserva**
export const modifyReservationService = async (
  reservationId: string,
  updatedData: Partial<IReservation>
) => {
  try {
    const response = await axiosInstance.put(`/reservations/${reservationId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al modificar la reserva:", error);
    throw error;
  }
};

// **Obtener una reserva por ID**
export const getReservationByIdService = async (reservationId: string) => {
  try {
    const response = await axiosInstance.get(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener la reserva por ID:", error);
    throw error;
  }
};
