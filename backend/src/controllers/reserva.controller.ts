import { Request, Response } from 'express';
import { 
  getReservationByIdService, 
  getAllReservationsService, 
  updateReservationService, 
  cancelReservationService, 
  getReservationsByIdService,
  getReservationsByRestaurantService,
  getReservationsByUserService,
  createCustomerReservationService,
  createManagerReservationService,
  createSuperadminReservationService
} from '../services/reservation.service';
import { IReservation } from '@delatte/shared/interfaces';
import { AuthRequest } from '@/types';


/**
 * Controlador para crear una reserva según el rol del usuario autenticado
 */
export const createReservationController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { restauranteId, fecha, horario, numAdultos, numNinos, pedidosEspeciales, clienteId } = req.body;
    const userRole = req.user.role; // customer, manager o superadmin

    if (!restauranteId || !fecha || !horario || numAdultos < 1) {
      res.status(400).json({ message: "Datos insuficientes para crear la reserva" });
      return;
    }

    let reserva;
    if (userRole === "customer") {
      if (clienteId && clienteId !== userId) {
        res.status(403).json({ message: "No puedes reservar en nombre de otro usuario" });
        return;
      }
      reserva = await createCustomerReservationService(userId, restauranteId, fecha, horario, numAdultos, numNinos, pedidosEspeciales);
    } else if (userRole === "manager") {
      reserva = await createManagerReservationService(userId, clienteId, restauranteId, fecha, horario, numAdultos, numNinos, pedidosEspeciales);
    } else if (userRole === "superadmin") {
      reserva = await createSuperadminReservationService(clienteId, restauranteId, fecha, horario, numAdultos, numNinos, pedidosEspeciales);
    } else {
      res.status(403).json({ message: "No tienes permisos para crear una reserva" });
      return;
    }

    res.status(201).json(reserva);
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ message: "Error interno al crear la reserva", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

//* Controlador para ver las reservas del usuario (cliente o manager)
export const getUserReservationsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }

    const result = await getReservationsByIdService(req.user._id.toString(), req.user.role);

    if (Array.isArray(result) && result.length === 0) {
      res.status(200).json({ message: "No hay reservas disponibles." });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};



//*Controlador para CANCELAR una reserva
export const cancelReservationController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservationId = req.params.id;

    const reservation = await cancelReservationService(reservationId);
    if (!reservation) {
      res.status(404).json({ message: "Reserva no encontrada." });
      return;
    }

    res.status(200).json({ message: "Reserva cancelada con éxito.", reservation });
  } catch (error) {
    console.error("Error cancelando la reserva:", error);
    res.status(500).json({ message: "Error cancelando la reserva", error });
  }
};

//*Controlador para MODIFICAR una reserva
export const updateReservationController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservationId = req.params.id;
    const updateData: Partial<IReservation> = req.body;

    const updatedReservation = await updateReservationService(reservationId, updateData);
    if (!updatedReservation) {
      res.status(404).json({ message: "Reserva no encontrada." });
      return;
    }

    res.status(200).json({ message: "Reserva actualizada con éxito.", updatedReservation });
  } catch (error) {
    console.error("Error actualizando la reserva:", error);
    res.status(500).json({ message: "Error actualizando la reserva", error });
  }
};

//*Controlador para TRAER TODAS las reservas
export const getAllReservationsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservations = await getAllReservationsService();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error obteniendo todas las reservas:", error);
    res.status(500).json({ message: "Error obteniendo todas las reservas", error });
  }
};


//*Controlador para BUSCAR una reserva por ID
export const getReservationByIdController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservationId = req.params.id;

    const reservation = await getReservationByIdService(reservationId);
    if (!reservation) {
      res.status(404).json({ message: "Reserva no encontrada." });
      return;
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error obteniendo la reserva:", error);
    res.status(500).json({ message: "Error obteniendo la reserva", error });
  }
};


// ✅ Obtener reservas de un restaurante
export const getReservationsByRestaurantController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const reservations = await getReservationsByRestaurantService(restaurantId);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas del restaurante." });
  }
};

// ✅ Obtener reservas de un usuario
export const getReservationsByUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const reservations = await getReservationsByUserService(userId);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas del usuario." });
  }
};