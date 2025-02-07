import { Request, Response } from "express";
import { 
  getUsersService, 
  suspendUserService, 
  deleteUserService, 
  updateUserService, 
  getUserDetailsService
} from "../services/admin.service";

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const users = await getUsersService(role);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};
export const getUserDetailsController = async (req: Request, res: Response) => {
  try {
    const user = await getUserDetailsService(req.params.id);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};
export const suspendUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await suspendUserService(id);
    res.status(200).json({ message: "Usuario suspendido con éxito", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al suspender usuario" });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al eliminar usuario" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserService(id, req.body);
    res.status(200).json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al actualizar usuario" });
  }
};
