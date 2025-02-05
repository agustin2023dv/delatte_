import { Response } from "express";
import { 
  createReviewService, 
  getReviewsByRestaurantService, 
  updateReviewService, 
  deleteReviewService 
} from "../services/review.service";
import { AuthRequest } from "@/types";

//* Controlador para CREAR una reseña
export const createReviewController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }

    // Llamar al servicio con el ID del usuario y los datos de la reseña
    const newReview = await createReviewService(req.user._id, req.body);

    res.status(201).json({ message: "Reseña creada con éxito", review: newReview });
  } catch (error) {
    console.error("Error en createReviewController:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Error interno del servidor" });
  }
};

//* Controlador para OBTENER reseñas de un restaurante
export const getReviewsByRestaurantController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await getReviewsByRestaurantService(req.params.restaurantId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Error interno del servidor" });
  }
};

//* Controlador para ACTUALIZAR una reseña
export const updateReviewController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedReview = await updateReviewService(req.params.reviewId, req.body);
    if (!updatedReview) {
      res.status(404).json({ message: "Reseña no encontrada." });
      return;
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Error interno del servidor" });
  }
};

//* Controlador para ELIMINAR una reseña
export const deleteReviewController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteReviewService(req.params.reviewId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Error interno del servidor" });
  }
};
