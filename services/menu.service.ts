import axiosInstance from "@/config/axiosInstance";
import { IMenu, IMenuItem } from "@/shared/interfaces/IMenu";

// **Obtener menús de un restaurante**
export const getMenusByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(`/menus/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los menús:", error);
    throw new Error("No se pudieron obtener los menús del restaurante.");
  }
};

// **Crear un nuevo menú**
export const createMenuService = async (menuData: Partial<IMenu>) => {
  try {
    const response = await axiosInstance.post("/menus", menuData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el menú:", error);
    throw new Error("No se pudo crear el menú.");
  }
};

// **Actualizar un menú existente**
export const updateMenuService = async (menuId: string, updateData: Partial<IMenu>) => {
  try {
    const response = await axiosInstance.put(`/menus/${menuId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el menú:", error);
    throw new Error("No se pudo actualizar el menú.");
  }
};

// **Eliminar un menú**
export const deleteMenuService = async (menuId: string) => {
  try {
    const response = await axiosInstance.delete(`/menus/${menuId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el menú:", error);
    throw new Error("No se pudo eliminar el menú.");
  }
};

// **Agregar un ítem a un menú**
export const addMenuItemService = async (menuId: string, itemData: IMenuItem) => {
  try {
    const response = await axiosInstance.post(`/menus/${menuId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar ítem al menú:", error);
    throw new Error("No se pudo agregar el ítem al menú.");
  }
};

// **Eliminar un ítem de un menú**
export const removeMenuItemService = async (menuId: string, itemId: string) => {
  try {
    const response = await axiosInstance.delete(`/menus/${menuId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar ítem del menú:", error);
    throw new Error("No se pudo eliminar el ítem del menú.");
  }
};
