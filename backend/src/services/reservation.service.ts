import Reservation from '../models/Reservation.model';
import { IReservation } from '@delatte/shared/interfaces';
import { getRestauranteIdByManagerService } from './restaurant.service';
import Restaurant from '../models/Restaurant.model';
import mongoose from 'mongoose';

/**
 * Crea una reserva como cliente (customer)
 */
export const createCustomerReservationService = async (
  userId: string,
  restauranteId: string,
  fecha: Date,
  horario: string,
  numAdultos: number,
  numNinos: number,
  pedidosEspeciales?: string
) => {
  // Verifica que el restaurante exista y esté abierto
  const restaurant = await Restaurant.findById(restauranteId);
  if (!restaurant) {
    throw new Error("Restaurante no encontrado");
  }

  return await Reservation.create({
    usuario: userId,
    restaurante: restauranteId,
    fecha,
    horario,
    numAdultos,
    numNinos,
    pedidosEspeciales,
    estado: "Confirmada",
  });
};

/**
 * Crea una reserva como manager (para clientes)
 */

export const createManagerReservationService = async (
  managerId: string,
  clienteId: string,
  restauranteId: string,
  fecha: Date,
  horario: string,
  numAdultos: number,
  numNinos: number,
  pedidosEspeciales?: string
) => {
  // Convertir los IDs a `ObjectId`
  const restauranteObjectId = new mongoose.Types.ObjectId(restauranteId);
  const clienteObjectId = new mongoose.Types.ObjectId(clienteId);
  const managerObjectId = new mongoose.Types.ObjectId(managerId);

  // Buscar el restaurante
  const restaurant = await Restaurant.findById(restauranteObjectId);
  if (!restaurant) {
    throw new Error("Restaurante no encontrado");
  }

  // Verificar si el manager tiene permisos sobre el restaurante
  const esCoManager = restaurant.coManagers.some(
    (coManager) => coManager.toString() === managerObjectId.toString()
  );
  const esManagerPrincipal = restaurant.managerPrincipal.toString() === managerObjectId.toString();

  if (!esCoManager && !esManagerPrincipal) {
    throw new Error("No puedes crear reservas en un restaurante que no administras");
  }

  // Crear la reserva
  return await Reservation.create({
    usuario: clienteObjectId,
    restaurante: restauranteObjectId,
    fecha,
    horario,
    numAdultos,
    numNinos,
    pedidosEspeciales,
    estado: "Confirmada",
  });
};
/**
 * Crea una reserva como superadmin (puede forzar reservas)
 */
export const createSuperadminReservationService = async (
  clienteId: string,
  restauranteId: string,
  fecha: Date,
  horario: string,
  numAdultos: number,
  numNinos: number,
  pedidosEspeciales?: string
) => {
  return await Reservation.create({
    usuario: clienteId,
    restaurante: restauranteId,
    fecha,
    horario,
    numAdultos,
    numNinos,
    pedidosEspeciales,
    estado: "Confirmada",
  });
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
