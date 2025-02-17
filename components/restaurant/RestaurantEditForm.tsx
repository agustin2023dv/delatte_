import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Switch,
} from "react-native";
import { IRestaurant } from "@delatte/shared";
import { updateRestaurantService } from "@/services/restaurant.service";
import { ImageManager } from "./ImageManager";
import HorariosManager from "./HorariosManager";
import { CapacidadManager, MenuManager } from "./CapacidadManager";

interface RestaurantEditFormProps {
  restaurant: IRestaurant;
  onUpdate: (updatedRestaurant: IRestaurant) => void;
}

export function RestaurantEditForm({ restaurant, onUpdate }: RestaurantEditFormProps) {
  const [formData, setFormData] = useState<Partial<IRestaurant>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(restaurant);
  }, [restaurant]);

  const handleInputChange = (field: keyof IRestaurant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedRestaurant = await updateRestaurantService(
        restaurant._id.toString(),
        formData
      );
      onUpdate(updatedRestaurant);
      Alert.alert("Éxito", "Restaurante actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el restaurante:", error);
      Alert.alert("Error", "No se pudo actualizar el restaurante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Restaurante</Text>

      {/* Información básica */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.nombre || ""}
        onChangeText={(value) => handleInputChange("nombre", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={formData.direccion || ""}
        onChangeText={(value) => handleInputChange("direccion", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Localidad"
        value={formData.localidad || ""}
        onChangeText={(value) => handleInputChange("localidad", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="País"
        value={formData.pais || ""}
        onChangeText={(value) => handleInputChange("pais", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Código Postal"
        value={formData.codigoPostal || ""}
        onChangeText={(value) => handleInputChange("codigoPostal", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={formData.telefono || ""}
        onChangeText={(value) => handleInputChange("telefono", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email de Contacto"
        value={formData.emailContacto || ""}
        onChangeText={(value) => handleInputChange("emailContacto", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={formData.descripcion || ""}
        onChangeText={(value) => handleInputChange("descripcion", value)}
      />

      {/* Estado del restaurante */}
      <View style={styles.switchContainer}>
        <Text>¿Está abierto?</Text>
        <Switch
          value={formData.estaAbierto || false}
          onValueChange={(value) => handleInputChange("estaAbierto", value)}
        />
      </View>

      {/* Gestión de imágenes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Galería de Imágenes</Text>
        <ImageManager
          restaurantId={restaurant._id.toString()}
          initialImages={restaurant.galeriaFotos || []}
          onImagesUpdated={(updatedImages) => {
            setFormData((prev) => ({ ...prev, galeriaFotos: updatedImages }));
          }}
        />
      </View>

      {/* Gestión de horarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗓️ Horarios de Atención</Text>
        <HorariosManager
          horarios={formData.horarios || []}
          setHorarios={(updatedHorarios) =>
            handleInputChange("horarios", updatedHorarios)
          }
        />
      </View>

      {/* Capacidad de mesas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🪑 Capacidad de Mesas</Text>
        <CapacidadManager
          capacidadMesas={formData.capacidadMesas || []}
          setCapacidadMesas={(updatedCapacidad) =>
            handleInputChange("capacidadMesas", updatedCapacidad)
          }
        />
      </View>



      {/* Botón para guardar cambios */}
      <Button
        title={loading ? "Guardando..." : "Guardar Cambios"}
        onPress={handleUpdate}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  section: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
