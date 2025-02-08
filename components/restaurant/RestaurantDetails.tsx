import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Modal,
} from "react-native";
import {
  getRestaurantByIdService,
  isUserManagerService,
} from "../../services/restaurant.service";
import { IRestaurant } from "../../shared/interfaces/IRestaurant";
import { FavoriteButton } from "../buttons/FavoriteButton";
import { ActivityIndicator } from "react-native-paper";
import { ReservationForm } from "../reservations/ReservationForm";
import { CreateReview } from "../reviews/CreateReviewComponent";
import { RestaurantEditForm } from "./RestaurantEditForm";
import { useUserRole } from "../../hooks/useUserRole";

interface RestaurantDetailsProps {
  restaurantId: string;
  visible: boolean;
  onClose: () => void;
}

export function RestaurantDetails({
  restaurantId,
  visible,
  onClose,
}: RestaurantDetailsProps) {
  const [restaurantInfo, setRestaurantInfo] = useState<Partial<IRestaurant> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const { userRole, loadingRole } = useUserRole();

  useEffect(() => {
    async function fetchRestaurantInfo() {
      try {
        const data = await getRestaurantByIdService(restaurantId);
        setRestaurantInfo(data);
      } catch (error) {
        console.error("Error al obtener información del restaurante:", error);
      } finally {
        setLoading(false);
      }
    }

    if (visible) {
      fetchRestaurantInfo();
    }
  }, [restaurantId, visible]);

  useEffect(() => {
    async function checkManagerStatus() {
      try {
        const isManager = await isUserManagerService(restaurantId);
        setIsManager(isManager);
      } catch (error) {
        console.error("Error al verificar si el usuario es manager:", error);
      }
    }
    checkManagerStatus();
  }, [restaurantId]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Button title="Cerrar" onPress={onClose} color="red" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" />
          <Text>Cargando...</Text>
        </View>
      ) : restaurantInfo ? (
        <ScrollView>
          <View style={styles.card}>
            {restaurantInfo.logo && (
              <Image
                source={{ uri: restaurantInfo.logo }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <Text style={styles.title}>{restaurantInfo.nombre}</Text>
            <Text style={styles.subtitle}>{restaurantInfo.direccion}</Text>
            <Text>{restaurantInfo.descripcion}</Text>

            <Text style={styles.sectionTitle}>📞 Información de Contacto</Text>
            <Text>Teléfono: {restaurantInfo.telefono}</Text>
            <Text>Email: {restaurantInfo.emailContacto}</Text>
            <Text>Localidad: {restaurantInfo.localidad}</Text>
            <Text>País: {restaurantInfo.pais}</Text>
            <Text>Código Postal: {restaurantInfo.codigoPostal}</Text>

            <Text style={styles.sectionTitle}>
              {restaurantInfo.estaAbierto ? "✅ Abierto" : "❌ Cerrado"}
            </Text>

            {/* Botones según el rol */}
            {!loadingRole && userRole === "customer" && (
              <View style={styles.actionsContainer}>
                <FavoriteButton restaurantId={restaurantId} />

                <Button
                  title="Dejar Reseña"
                  onPress={() => setReviewModalVisible(true)}
                />

                <Button
                  title="Reservar Mesa"
                  onPress={() => setReservationModalVisible(true)}
                />
              </View>
            )}

            {!loadingRole &&
              (userRole === "manager" || userRole === "superadmin") && (
                <Button
                  title="Reservar Mesa"
                  onPress={() => setReservationModalVisible(true)}
                />
              )}

            {isManager && (
              <Button
                title="Editar Restaurante"
                onPress={() => setEditModalVisible(true)}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <Text>No se encontró información del restaurante.</Text>
      )}

      {/* Modal para crear una reserva */}
      <Modal visible={reservationModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Button title="Cerrar" onPress={() => setReservationModalVisible(false)} />
          <ReservationForm
            restaurantId={restaurantId}
            onReservationCreated={() => {
              setReservationModalVisible(false);
              alert("Reserva creada exitosamente.");
            }}
          />
        </View>
      </Modal>

      {/* Modal para dejar una reseña */}
      <Modal visible={reviewModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Button title="Cerrar" onPress={() => setReviewModalVisible(false)} />
          <CreateReview
            restaurantId={restaurantId}
            onReviewCreated={() => {
              setReviewModalVisible(false);
              alert("Reseña creada exitosamente.");
            }}
          />
        </View>
      </Modal>

      {/* Modal para editar el restaurante */}
      {restaurantInfo && (
        <RestaurantEditForm
          restaurant={restaurantInfo as IRestaurant}
          onUpdate={(updatedRestaurant) => setRestaurantInfo(updatedRestaurant)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
  },
  actionsContainer: {
    marginTop: 10,
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
});
