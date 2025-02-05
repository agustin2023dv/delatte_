import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { getItem, setItem, removeItem } from "@/storage/storage";

// Interfaz para el token decodificado
interface DecodedToken {
  id: string;
  emailContacto: string; 
  exp: number; // Expiración del token en UNIX timestamp
  iat: number;
}

// Propiedades del contexto
interface AuthContextProps {
  id: string | null;
  email: string | null;
  isSigned: boolean;
  isLoading: boolean;
  setSession: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [id, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar la sesión desde el almacenamiento al inicio
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const token = await getItem("token");
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp < currentTime) {
            console.warn("🔴 Token expirado. Eliminando sesión.");
            await removeItem("token");
          } else if (isMounted) {
            setUserId(decodedToken.id);
            setEmail(decodedToken.emailContacto);
            setIsSigned(true);
          }
        }
      } catch (error) {
        console.error("❌ Error al cargar la sesión:", error);
        await removeItem("token");
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadSession();
    return () => { isMounted = false; };
  }, []);

  // Función para establecer una sesión (guardar token)
  const setSession = useCallback(async (token: string) => {
    try {
      await setItem("token", token);
      const decodedToken = jwtDecode<DecodedToken>(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        console.warn("🔴 Intento de guardar un token expirado.");
        await removeItem("token");
        return;
      }

      setUserId(decodedToken.id);
      setEmail(decodedToken.emailContacto);
      setIsSigned(true);
    } catch (error) {
      console.error("❌ Error al establecer la sesión:", error);
    }
  }, []);

  // Función para cerrar sesión
  const logout = useCallback(async () => {
    try {
      await removeItem("token");
      setUserId(null);
      setEmail(null);
      setIsSigned(false);
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ id, email, isSigned, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
