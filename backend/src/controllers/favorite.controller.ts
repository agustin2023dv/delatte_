import { Request, Response } from "express";
import {
  addFavoriteRestaurantService,
  getUserFavoritesService,
  removeFavoriteRestaurantService,
} from "../services/favorite.service";
import { AuthRequest } from "@/types";


// **Controlador para obtener favoritos del usuario**

export const getUserFavoritesController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const userId = req.user.id;
    const favorites = await getUserFavoritesService(userId);

    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error interno del servidor",
    });
  }
};

// **Controlador para agregar un restaurante a favoritos**
export const addFavoriteRestaurantController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const userId = req.user.id;
    const { restaurantId } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "El ID del restaurante es obligatorio" });
      return;
    }

    const user = await addFavoriteRestaurantService(userId, restaurantId);

    res.status(200).json({
      message: "Restaurante agregado a favoritos con éxito",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error en addFavoriteRestaurantController:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error interno del servidor",
    });
  }
};
  // **Controlador para eliminar un restaurante de favoritos**
  export const removeFavoriteRestaurantController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
  
      const userId = req.user.id;
      const { restaurantId } = req.body;
  
      if (!restaurantId) {
        res.status(400).json({ message: "El ID del restaurante es obligatorio" });
        return;
      }
  
      const user = await removeFavoriteRestaurantService(userId, restaurantId);
  
      res.status(200).json({
        message: "Restaurante eliminado de favoritos con éxito",
        favorites: user.favorites,
      });
    } catch (error) {
      console.error("Error en removeFavoriteRestaurantController:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Error interno del servidor",
      });
    }
  };