import { loginUser } from "../../auth/login.service";

// **Servicio para iniciar sesión como Customer**
export const loginCustomerService = async (email: string, password: string) => {
  return await loginUser("/auth", email, password);
};


