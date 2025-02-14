import express from 'express';
import { 
  createReviewController, 
  getReviewsByRestaurantController,
  getAllReviewsController,
  getReviewsByUserController,
  updateReviewController, 
  deleteReviewController 
} from '../controllers/resena.controller';

import { validateReview, validateReviewUpdate } from '../../../shared/utils/review.validation';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = express.Router();

// 🔹 Obtener todas las reseñas (Solo Superadmin)
router.get('/all', authMiddleware, roleMiddleware(['superadmin']), getAllReviewsController);

// 🔹 Obtener reseñas por restaurante
router.get('/restaurant/:restaurantId', getReviewsByRestaurantController);

// 🔹 Obtener reseñas por usuario
router.get('/user/:userId', authMiddleware, getReviewsByUserController);

// 🔹 Crear una nueva reseña (Solo clientes pueden dejar reseñas)
router.post('/create-review', 
    authMiddleware, 
    roleMiddleware(['customer']), 
    validateReview, 
    createReviewController);

// 🔹 Editar una reseña (Solo clientes pueden editar sus reseñas)
router.put('/:reviewId', 
    authMiddleware, 
    roleMiddleware(['customer']),
    validateReviewUpdate, 
    updateReviewController);

// 🔹 Borrar una reseña (Clientes pueden borrar su reseña / Superadmin puede borrar cualquier reseña)
router.delete(
    '/:reviewId', 
    authMiddleware, 
    roleMiddleware(['customer', 'superadmin']), 
    deleteReviewController
  );

export default router;
