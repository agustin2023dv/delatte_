import axiosInstance from "@/config/axios/axiosInstance";

// **Obtener las direcciones del usuario**
export const getUserAddressesService = async () => {
  try {
    const response = await axiosInstance.get("/addresses");
    return response.data; // Retorna las direcciones del usuario
  } catch (error) {
    console.error("Error en getUserAddressesService:", error);
    throw new Error("Error al obtener las direcciones");
  }
};

// **Agregar una nueva dirección**
export const addAddressService = async (newAddress: string) => {
  try {
    const response = await axiosInstance.post("/addresses", { address: newAddress });
    return response.data; // Retorna las direcciones actualizadas
  } catch (error) {
    console.error("Error en addAddressService:", error);
    throw new Error("Error al agregar la dirección");
  }
};

// **Eliminar una dirección existente**
export const removeAddressService = async (address: string) => {
  try {
    const response = await axiosInstance.delete("/addresses", { data: { address } });
    return response.data; // Retorna las direcciones actualizadas
  } catch (error) {
    console.error("Error en removeAddressService:", error);
    throw new Error("Error al eliminar la dirección");
  }
};
