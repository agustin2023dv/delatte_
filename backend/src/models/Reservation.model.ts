import { IReservation } from "@delatte/shared/interfaces";
import mongoose, { Schema } from "mongoose";

const ReservaSchema: Schema = new Schema<IReservation>({
  restaurante: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fecha: { type: Date, required: true },
  horario: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  numAdultos: { type: Number, required: true, min: 1, default: 1 },
  numNinos: { type: Number, min: 0, default: 0 },
  pedidosEspeciales: { type: String, maxlength: 500 },
  estado: { type: String, enum: ["Pasada", "Confirmada", "Cancelada"], default: "Confirmada" },
  fechaCreacion: { type: Date, default: Date.now },
});

// Índices para optimización de consultas
ReservaSchema.index({ restaurante: 1 });
ReservaSchema.index({ usuario: 1 });
ReservaSchema.index({ fecha: 1 });
ReservaSchema.index({ restaurante: 1, fecha: 1, horario: 1 }, { unique: false });

// Middleware para actualizar automáticamente reservas pasadas
ReservaSchema.pre("save", function (next) {
  const now = new Date();
  if (this.isModified("fecha") && this.fecha instanceof Date) {
    if (this.fecha < now && this.estado === "Pendiente") {
      this.estado = "Cancelada";
    }
  }
  next();
});



const Reservation = mongoose.model<IReservation>("Reservation", ReservaSchema, "reservas");
export default Reservation;
