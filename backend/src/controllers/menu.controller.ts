import { Request, Response } from "express";
import {
  getMenusByRestaurantService,
  createMenuService,
  updateMenuService,
  deleteMenuService,
  addMenuItemService,
  removeMenuItemService
} from "../services/menu.service";
import { AuthRequest } from "@/types";

// Obtener menús por restaurante
export const getMenusByRestaurantController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const menus = await getMenusByRestaurantService(restaurantId);
    res.status(200).json(menus);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los menús." });
    return;
  }
};

// Crear un nuevo menú
export const createMenuController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const newMenu = await createMenuService(req.body);
     res.status(201).json(newMenu);
    return;
    } catch (error) {
     res.status(500).json({ message: "Error al crear el menú." });
      return;
    }
};

// Actualizar un menú
export const updateMenuController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const updatedMenu = await updateMenuService(menuId, req.body);
    if (!updatedMenu) { res.status(404).json({ message: "Menú no encontrado." });
  return}
  res.status(200).json(updatedMenu);
    return ;
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el menú." });
    return ;
  }
};

// Eliminar un menú
export const deleteMenuController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const deletedMenu = await deleteMenuService(menuId);
    if (!deletedMenu){ res.status(404).json({ message: "Menú no encontrado." }); return;}
    
    res.status(200).json({ message: "Menú eliminado correctamente." });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el menú." });
    return;
  }
};

// Agregar ítem a un menú
export const addMenuItemController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const updatedMenu = await addMenuItemService(menuId, req.body);
    if (!updatedMenu) {res.status(404).json({ message: "Menú no encontrado." }); return;}
    res.status(200).json(updatedMenu);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al agregar ítem al menú." });
    return;
  }
};

// Eliminar ítem de un menú
export const removeMenuItemController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const updatedMenu = await removeMenuItemService(menuId, itemId);
    if (!updatedMenu) { res.status(404).json({ message: "Ítem o menú no encontrado." }); return;}
    res.status(200).json(updatedMenu);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ítem del menú." });
    return;
  }
};
