import express from "express";
import { 
  cancelReservationController, 
  updateReservationController, 
  getAllReservationsController, 
  getReservationByIdController, 
  getUserReservationsController,
  getReservationsByRestaurantController, 
  getReservationsByUserController, 
  createReservationController
} from "../controllers/reserva.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { checkDisponibilidadMiddleware, validateReservationData } from "../middlewares/reservation.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware, // Verifica autenticación
  validateReservationData, // Valida los datos de la reserva
  checkDisponibilidadMiddleware, // Verifica disponibilidad del restaurante
  createReservationController
);

// ✅ Ver reservas del usuario autenticado (clientes y managers)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["customer", "manager"]),
  getUserReservationsController
);

// ✅ Obtener reservas de un restaurante (solo superadmins y managers del restaurante)
router.get(
  "/restaurant/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "manager"]),
  getReservationsByRestaurantController
);

// ✅ Obtener reservas de un usuario (solo superadmins)
router.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getReservationsByUserController
);

// ✅ Cancelar una reserva
router.put(
  "/cancelar/:id",
  authMiddleware,
  cancelReservationController
);

// ✅ Modificar una reserva
router.put(
  "/modificar/:id", 
  authMiddleware,
  validateReservationData,
  updateReservationController
);

// ✅ Obtener todas las reservas (solo superadmins)
router.get(
  "/all-reservations",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllReservationsController
);

// ✅ Buscar una reserva por ID
router.get(
  "/:id",
  authMiddleware,
  getReservationByIdController
);

export default router;
