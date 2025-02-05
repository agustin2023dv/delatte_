import { isAxiosError } from "axios";
import axiosInstance from "@/config/axiosInstance";

// **Servicio para solicitar restablecimiento de contraseña**
export const requestPasswordResetService = async (email: string): Promise<void> => {
  try {
    const response = await axiosInstance.post("/auth/request-password-reset", { email });
    console.log("✅ Enlace de restablecimiento enviado:", response.data.message);
  } catch (error) {
    handleAuthError(error, "Error al solicitar el restablecimiento de contraseña");
  }
  return; 
};

// **Servicio para restablecer la contraseña**
export const resetPasswordService = async (
  userId: string,
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const response = await axiosInstance.post("/auth/password-reset", {
      token,
      userId,
      newPassword,
    });
    console.log("✅ Contraseña restablecida exitosamente:", response.data.message);
  } catch (error) {
    handleAuthError(error, "Error al restablecer la contraseña");
  }
  return; 
};

// **Servicio para cambiar la contraseña**
export const changePasswordService = async (
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<void> => {
  try {
    await axiosInstance.put("/auth/change-password", {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    console.log("✅ Contraseña cambiada exitosamente");
  } catch (error) {
    handleAuthError(error, "Error al cambiar la contraseña");
  }
  return; 
};

// **Servicio para verificar el email**
export const verifyEmailService = async (
  emailToken: string
): Promise<{ success: boolean; token?: string; message: string }> => {
  try {
    const response = await axiosInstance.get("/auth/verify-email", {
      params: { token: emailToken },
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
