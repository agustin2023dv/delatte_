import { IUser } from "@/shared/interfaces/IUser";
import User from "../models/User.model";
import mongoose from "mongoose";

export const getUsersService = async (role?: string) => {
  const query = role ? { role } : {}; 
  return await User.find(query).select("-password"); 
};

// Suspender usuario (validación de ID y manejo de `isActive`)
export const suspendUserService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID de usuario no válido");
    }
  
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    if (!user.isActive) {
      throw new Error("El usuario ya está suspendido");
    }
  
    return await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
  };
  
  // Eliminar usuario (validación de ID y evitar eliminar superadmins)
  export const deleteUserService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID de usuario no válido");
    }
  
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    if (user.role === "superadmin") {
      throw new Error("No se puede eliminar un superadmin");
    }
  
    return await User.findByIdAndDelete(userId);
  };
  
  export const getUserDetailsService = async (userId: string) => {
    return await User.findById(userId)
      .populate("favoriteRestaurants", "nombre") // Solo el nombre del restaurante favorito
      .populate({
        path: "reservations",
        select: "-_id", // Trae todo excepto `_id`
        populate: { path: "restaurante", select: "nombre direccion telefono emailContacto" }, // Muestra datos clave del restaurante
      })
      .populate({
        path: "reviews",
        select: "-_id -ultimaActualizacion", // Excluye `ultimaActualizacion`
        populate: { path: "restaurante", select: "nombre" }, // Muestra solo el nombre del restaurante en la review
      });
  };

  // Actualizar usuario (validación de ID)
  export const updateUserService = async (userId: string, updateData: Partial<IUser>) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID de usuario no válido");
    }
  
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  };