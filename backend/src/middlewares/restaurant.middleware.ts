import { Request, Response, NextFunction } from 'express';
import  Restaurant  from '../models/Restaurant.model';
import { AuthRequest } from '@/types';

/* Middleware para verificar si el usuario es el manager del restaurante*/
export const managerOfRestaurantMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurante no encontrado" });
      return;
    }

    const userId = req.user._id.toString();
    const isManagerPrincipal = restaurant.managerPrincipal?.toString() === userId;
    const isCoManager = restaurant.coManagers?.some((coManagerId) => coManagerId.toString() === userId);

    if (!isManagerPrincipal && !isCoManager && req.user.role !== "superadmin") {
      res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
      return;
    }

    next(); // El usuario es un manager principal, coManager o superadmin, continuar
  } catch (error) {
    console.error("Error en el middleware managerOfRestaurant:", error);
    res.status(500).json({ message: "Error al verificar el manager del restaurante", error });
  }
};

//*
export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  const { ubicacion, tipoComida } = req.query;

  if (!ubicacion && !tipoComida) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un parámetro de búsqueda (ubicacion o tipo de comida)' });
  }

  next();
};