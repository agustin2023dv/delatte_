import { isAxiosError } from "axios";
import axiosInstance from "@/config/axiosInstance";

// **Servicio para solicitar restablecimiento de contraseña**
export const requestPasswordResetService = async (email: string): Promise<void> => {
  try {
    const response = await axiosInstance.post("/users/password-reset-requests", { email });
    console.log("✅ Enlace de restablecimiento enviado:", response.data.message);
  } catch (error) {
    handleAuthError(error, "Error al solicitar el restablecimiento de contraseña");
  }
};

// **Servicio para restablecer la contraseña**
export const resetPasswordService = async (token: string, newPassword: string): Promise<void> => {
  try {
    const response = await axiosInstance.post("/users/password-resets", {
      token,
      newPassword,
    });
    console.log("✅ Contraseña restablecida exitosamente:", response.data.message);
  } catch (error) {
    handleAuthError(error, "Error al restablecer la contraseña");
  }
};

// **Servicio para cambiar la contraseña**
export const changePasswordService = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    await axiosInstance.put("/users/password", {
      oldPassword,
      newPassword,
    });
    console.log("✅ Contraseña cambiada exitosamente");
  } catch (error) {
    handleAuthError(error, "Error al cambiar la contraseña");
  }
};

// **Servicio para verificar el email**
export const verifyEmailService = async (emailToken: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post("/users/email-verification", {
      token: emailToken,
    });
    return response.data;
  } catch (error) {
    handleAuthError(error, "Error al verificar el email");
    return { success: false, message: "Error al verificar el email" };
  }
};

// **Manejo centralizado de errores**
const handleAuthError = (error: any, defaultMessage: string) => {
  console.error(`❌ ${defaultMessage}:`, error);
  throw new Error(
    isAxiosError(error) 
      ? error.response?.data?.message || defaultMessage
      : "Error inesperado"
  );
};
