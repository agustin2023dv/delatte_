import express from 'express';
import {
  addMenuItemController,
  createMenuController,
  deleteMenuController,
  getMenusByRestaurantController,
  removeMenuItemController,
  updateMenuController,
} from "../controllers/menu.controller";

const router = express.Router();

// Rutas con más especificidad primero

router.post("/:menuId/items", addMenuItemController);
router.delete("/:menuId/items/:itemId", removeMenuItemController);

// CRUD de Menú
router.post("/", createMenuController);
router.put("/:menuId", updateMenuController);
router.delete("/:menuId", deleteMenuController);

// Obtener menús de un restaurante
router.get("/restaurant/:restaurantId", getMenusByRestaurantController);

export default router;
