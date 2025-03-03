import Reservation from '../models/Reservation.model';
import { IReservation } from '@delatte/shared/interfaces';
import { getRestauranteIdByManagerService } from './restaurant.service';
import mongoose from 'mongoose';

// Servicio para crear una reserva
export const createReservationService = async (reservationData: Partial<IReservation>) => {
  const { restaurante, usuario, fecha, horario, numAdultos, numNinos, pedidosEspeciales } = reservationData;

  // Validar campos obligatorios
  if (!restaurante || !usuario || !fecha || !horario || numAdultos === undefined || numNinos === undefined) {
    throw new Error("Todos los campos obligatorios deben ser proporcionados.");
  }

  // Convertir restaurante de string a ObjectId
  const restauranteId = new mongoose.Types.ObjectId(restaurante as unknown as string);

  // Crear la reserva
  const newReservation = new Reservation({
    restaurante: restauranteId, // Convertido a ObjectId
    usuario,
    fecha,
    horario,
    numAdultos,
    numNinos,
    pedidosEspeciales,
    estado: "Pendiente",
    fechaCreacion: new Date(),
  });

  return await newReservation.save();
};
// Servicio para obtener una reserva por su ID
export const getReservationByIdService = async (id: string) => {
  return await Reservation.findById(id)
    .populate("restaurante", "nombre direccion")
    .populate("usuario", "nombre apellido email"); 
};


// Servicio para actualizar una reserva
export const updateReservationService = async (reservationId: string, updatedData: Partial<IReservation>) => {
  try {
    // Verifica si "fecha" existe antes de crear un objeto Date
    const fecha = updatedData.fecha ? new Date(updatedData.fecha) : undefined;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        ...updatedData,
        ...(fecha && { fecha }), // Solo incluye "fecha" si está definido
      },
      { new: true }
    );

    if (!updatedReservation) {
      throw new Error("No se encontró la reserva para actualizar.");
    }

    return updatedReservation;
  } catch (error) {
    throw new Error("Error actualizando la reserva");
  }
};



// Servicio para cancelar una reserva
export const cancelReservationService = async (reservationId: string) => {
  try {
    const canceledReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { estado: "Cancelada" }, 
      { new: true }
    );
    if (!canceledReservation) {
      throw new Error("No se encontró la reserva para cancelar.");
    }
    return canceledReservation;
  } catch (error) {
    throw new Error("Error cancelando la reserva");
  }
};
// Servicio para obtener todas las reservas (solo superadmins)
export const getAllReservationsService = async () => {
  try {
    return await Reservation.find()
      .populate("restaurante", "nombre direccion")
      .populate("usuario", "nombre apellido email"); 
  } catch (error) {
    throw new Error("Error obteniendo todas las reservas");
  }
};


export const getReservationsByIdService = async (userId: string, role: string) => {
  let reservations;

  if (role === "customer") {
    // Obtener reservas del cliente
    reservations = await Reservation.find({ usuario: userId }) // Cambiado cliente -> usuario
      .populate("restaurante", "nombre apellido direccion");
  } else if (role === "manager") {
    // Obtener reservas del restaurante del manager
    const restauranteId = await getRestauranteIdByManagerService(userId);
    reservations = await Reservation.find({ restaurante: restauranteId })
      .populate("usuario", "nombre direccion email"); // Cambiado cliente -> usuario
  } else {
    throw new Error("Rol no válido o usuario no encontrado.");
  }

  // Si no hay reservas
  if (!reservations || reservations.length === 0) {
    return { message: "No hay reservas disponibles." };
  }

  return reservations;
};

// ✅ Obtener reservas de un restaurante
export const getReservationsByRestaurantService = async (restaurantId: string) => {
  try {
    return await Reservation.find({ restaurante: restaurantId })
      .populate("usuario", "nombre apellido email phone")
  } catch (error) {
    throw new Error("Error al obtener reservas del restaurante.");
  }
};

// ✅ Obtener reservas de un usuario
export const getReservationsByUserService = async (userId: string) => {
  try {
    return await Reservation.find({ usuario: userId })
      .populate("usuario", "nombre apellido email")
      .populate("restaurante", "nombre direccion");
  } catch (error) {
    throw new Error("Error al obtener reservas del usuario.");
  }
};
