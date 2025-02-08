import { Request, Response } from "express";
import {
  getMenusByRestaurantService,
  createMenuService,
  updateMenuService,
  deleteMenuService,
  addMenuItemService,
  removeMenuItemService
} from "../services/menu.service";

// Obtener menús por restaurante
export const getMenusByRestaurantController = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const menus = await getMenusByRestaurantService(restaurantId);
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los menús." });
  }
};

// Crear un nuevo menú
export const createMenuController = async (req: Request, res: Response) => {
  try {
    const newMenu = await createMenuService(req.body);
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el menú." });
  }
};

// Actualizar un menú
export const updateMenuController = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    const updatedMenu = await updateMenuService(menuId, req.body);
    if (!updatedMenu) return res.status(404).json({ message: "Menú no encontrado." });
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el menú." });
  }
};

// Eliminar un menú
export const deleteMenuController = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    const deletedMenu = await deleteMenuService(menuId);
    if (!deletedMenu) return res.status(404).json({ message: "Menú no encontrado." });
    res.status(200).json({ message: "Menú eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el menú." });
  }
};

// Agregar ítem a un menú
export const addMenuItemController = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    const updatedMenu = await addMenuItemService(menuId, req.body);
    if (!updatedMenu) return res.status(404).json({ message: "Menú no encontrado." });
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar ítem al menú." });
  }
};

// Eliminar ítem de un menú
export const removeMenuItemController = async (req: Request, res: Response) => {
  try {
    const { menuId, itemId } = req.params;
    const updatedMenu = await removeMenuItemService(menuId, itemId);
    if (!updatedMenu) return res.status(404).json({ message: "Ítem o menú no encontrado." });
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ítem del menú." });
  }
};
