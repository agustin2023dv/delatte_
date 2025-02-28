import express from 'express';
import {
  getUserByIDController,
  getUserProfileController,
  updateUserDataController,
} from '../controllers/usuario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rutas relacionadas con el perfil del usuario
router.get('/', authMiddleware, getUserProfileController);
router.put('/', authMiddleware, updateUserDataController);
router.get('/:id', authMiddleware,getUserByIDController);

export default router;
