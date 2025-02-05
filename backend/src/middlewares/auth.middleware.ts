import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthRequest } from '@/types';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No se proporcionó un token de autenticación" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};



export const extractResetTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
  req.body.token = token; // Agregar el token al cuerpo para su uso posterior
  next();
};