import axiosInstance from "@/config/axiosInstance";

// **Servicio para crear una review**
export const createReviewService = async (reviewData: {
  restaurante: string;
  calificacion: number;
  comentario: string;
}) => {
  try {
    // Validación del ID del restaurante
    if (!reviewData.restaurante || typeof reviewData.restaurante !== "string") {
      throw new Error("ID del restaurante es inválido o no se proporcionó.");
    }

    // Enviar solicitud al backend
    const response = await axiosInstance.post("/reviews/create-review", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error en createReviewService:", error);
    throw new Error("Error al crear la reseña");
  }
};
