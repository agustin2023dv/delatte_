import { Response } from "express";
import { 
  getUserByIDService,
  getUserDataService, 
  loginCustomerService, 
  loginManagerService, 
  registerUserService, 
  updateUserDataService 
} from "../services/user.service";
import { 
  changePasswordService, 
  hashPasswordService, 
  requestPasswordResetService, 
  resetPasswordService 
} from "../services/auth.service";
import { sendEmailService } from "../services/email.service";
import User from "../models/User.model";
import { AuthRequest } from "@/types";

//** Controlador para registrar un nuevo usuario **
export const registrarUsuarioController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, email, password } = req.body;

    const hashedPassword = await hashPasswordService(password);
    const newUser = await registerUserService(nombre, apellido, email, hashedPassword);

    const verificationLink = `http://localhost:8081/api/auth/verify-email?token=${newUser.emailToken}`;
    await sendEmailService({
      to: email,
      subject: "Verifica tu email",
      text: `Hola ${nombre}, por favor verifica tu cuenta haciendo clic en el siguiente enlace: ${verificationLink}`,
      html: `<h1>Hola ${nombre}!</h1><p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p><a href="${verificationLink}">Verificar Email</a>`,
    });

    res.status(201).json({ message: "Usuario registrado con éxito. Por favor verifica tu email.", user: newUser });
  } catch (error) {
    console.error("Error en registrarUsuarioController:", error);
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al registrar el usuario" });
  }
};

//** Controladores para iniciar sesión **
export const loginCustomerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginCustomerService(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al iniciar sesión" });
  }
};

export const loginManagerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginManagerService(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al iniciar sesión" });
  }
};

//** Controlador para verificar el email **
export const verificarEmailController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emailToken = req.query.token as string;
    if (!emailToken) {
      res.redirect(`http://localhost:8082/(auth)/VerifyEmail?status=error&message=TokenNoProporcionado`);
      return;
    }

    const user = await User.findOne({ emailToken });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.redirect(`http://localhost:8082/(auth)/VerifyEmail?status=success&message=EmailVerificado`);
    } else {
      res.redirect(`http://localhost:8082/(auth)/VerifyEmail?status=error&message=TokenInvalido`);
    }
  } catch (error) {
    res.redirect(`http://localhost:8082/(auth)/VerifyEmail?status=error&message=ServerError`);
  }
};

//** Controlador para obtener el perfil del usuario **
export const getUserProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const user = await getUserDataService(req.user.id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

//** Controlador para actualizar el perfil del usuario **
export const updateUserDataController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const updatedUser = await updateUserDataService(req.body);
    res.status(200).json({ message: "Datos del usuario actualizados con éxito", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los datos del usuario", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

//** Controlador para cambiar contraseña **
export const cambiarContrasenaController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
      return;
    }

    const result = await changePasswordService(req.user.id, oldPassword, newPassword, confirmNewPassword);
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//** Controlador para solicitar restablecimiento de contraseña **
export const requestPasswordResetController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "El correo es obligatorio." });
      return;
    }

    await requestPasswordResetService(email);
    res.status(200).json({ message: "Se ha enviado un enlace de restablecimiento a tu correo electrónico." });
  } catch (error) {
    console.error("Error en requestPasswordResetController:", error);
    res.status(500).json({ message: "Error al solicitar el restablecimiento de contraseña." });
  }
};

//** Controlador para restablecer la contraseña con el token **
export const resetPasswordController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token, userId, newPassword } = req.body;

    if (!token || !userId || !newPassword) {
      res.status(400).json({ message: "Faltan datos requeridos." });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo." });
      return;
    }

    await resetPasswordService(token, userId, newPassword);
    res.status(200).json({ message: "Contraseña restablecida exitosamente." });
  } catch (error) {
    console.error("Error en resetPasswordController:", error);
    res.status(500).json({ message: "Error al restablecer la contraseña." });
  }
};


export const getUserByIDController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
      const {id} = req.params;

      if (!id) {
           res.status(404).json({ message: "Usuario no encontrado" });
           return;
      }

      const user = getUserByIDService(id);
      
      res.status(200).json(user);
  } catch (error) {
      console.error("Error en getUserByIDController:", error);
      res.status(500).json({ message: "Error interno del servidor" });
      return;
  }
};