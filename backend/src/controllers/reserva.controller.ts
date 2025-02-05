import { Request, Response } from 'express';
import { 
  createReservationService, 
  getReservationByIdService, 
  getAllReservationsService, 
  updateReservationService, 
  cancelReservationService, 
  getReservationsByIdService
} from '../services/reservation.service';
import { IReservation } from '../../../shared/interfaces/IReservation';
import { AuthRequest } from '@/types';

//* Controlador para CREAR una reserva

export const createReservationController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }

    const reservationData = {
      ...req.body,
      usuario: req.user._id,
    };

    const reservation = await createReservationService(reservationData);
    res.status(201).json({ message: "Reserva creada con éxito.", reservation });
  } catch (error) {
    console.error("Error creando la reserva:", error);
    res.status(500).json({ message: "Error creando la reserva", error });
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
