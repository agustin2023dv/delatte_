// Validar la fecha
export const validateFecha = (fecha: string): string | null => {
  const hoy = new Date();
  const fechaReserva = new Date(fecha);

  if (!fecha) {
    return "La fecha es requerida.";
  }
  if (fechaReserva < hoy) {
    return "La fecha no puede ser en el pasado.";
  }

  return null; // No hay errores
};

// Validar el horario
export const validateHorario = (horario: string): string | null => {
  const horarioRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!horario) {
    return "El horario es requerido.";
  }
  if (!horarioRegex.test(horario)) {
    return "El formato de la hora no es válido. Usa el formato HH:MM.";
  }

  return null; // No hay errores
};

// Validar el número de adultos
export const validateNumAdultos = (numAdultos: number): string | null => {
  if (numAdultos === undefined || numAdultos === null) {
    return "La cantidad de adultos es requerida.";
  }
  if (numAdultos < 1) {
    return "Debe haber al menos 1 adulto en la reserva.";
  }
  if (numAdultos > 25) {
    return "La cantidad máxima de adultos es 25.";
  }

  return null; // No hay errores
};

// Validar el número de niños
export const validateNumNinos = (numNinos: number): string | null => {
  if (numNinos > 10) {
    return "La cantidad máxima de niños es 10.";
  }
  if (numNinos < 0) {
    return "La cantidad de niños no puede ser negativa.";
  }

  return null; // No hay errores
};
