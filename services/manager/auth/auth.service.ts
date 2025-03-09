import { loginUser } from "../../auth/login.service";

// **Servicio para iniciar sesión como Manager**
export const loginManagerService = async (email: string, password: string) => {
  return await loginUser("/auth/manager", email, password);
};
