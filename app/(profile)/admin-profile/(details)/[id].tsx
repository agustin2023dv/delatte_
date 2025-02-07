import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getUserDetailsService } from "@/services/user/admin.service";

interface UserDetails {
  nombre: string;
  apellido: string;
  email: string;
  favoriteRestaurants: { nombre: string }[];
  reservations: { fecha: string; restaurante: string }[];
  reviews: { restaurante: string; comentario: string }[];
}

const CustomerProfile = () => {
  const { id } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      if (typeof id === "string") {
        const data = await getUserDetailsService(id); 
        setUserDetails(data);

      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener el perfil del usuario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Perfil del Cliente</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userDetails ? (
        <View>
          <Text>Nombre: {userDetails.nombre} {userDetails.apellido}</Text>
          <Text>Email: {userDetails.email}</Text>

          <Text style={{ fontSize: 18, marginTop: 10 }}>⭐ Restaurantes Favoritos:</Text>
          <FlatList
            data={userDetails.favoriteRestaurants}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item }) => <Text>- {item.nombre}</Text>}
          />

          <Text style={{ fontSize: 18, marginTop: 10 }}>📅 Historial de Reservas:</Text>
          <FlatList
            data={userDetails.reservations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>- {item.fecha} en {item.restaurante}</Text>}
          />

          <Text style={{ fontSize: 18, marginTop: 10 }}>📝 Reviews Publicadas:</Text>
          <FlatList
            data={userDetails.reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>- {item.restaurante}: {item.comentario}</Text>}
          />
        </View>
      ) : (
        <Text>No se encontraron datos del usuario.</Text>
      )}
    </View>
  );
};

export default CustomerProfile;
