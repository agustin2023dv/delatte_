import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { Link } from "expo-router";
import { deleteUserService, getUsersService, suspendUserService } from "@/services/user/admin.service";

interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  active: boolean;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsersService(selectedRole !== "all" ? selectedRole : undefined);
      setUsers(usersData);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await suspendUserService(id);
      Alert.alert("Éxito", "El usuario ha sido actualizado.");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario.");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteUserService(id);
      Alert.alert("Éxito", "Usuario eliminado correctamente.");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el usuario.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Gestión de Usuarios</Text>

      <SegmentedButtons
        value={selectedRole}
        onValueChange={setSelectedRole}
        buttons={[
          { value: "all", label: "Todos" },
          { value: "customer", label: "Clientes" },
          { value: "manager", label: "Managers" },
        ]}
        style={{ marginBottom: 15 }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ddd" }}>
              <Text>{item.nombre} {item.apellido} - {item.email}</Text>
              <Text>Rol: {item.role} | Estado: {item ? "Activo" : "Suspendido"}</Text>

            
              {item.role === "customer" && (
                  <Link
                    href={{
                      pathname: "/(profile)/admin-profile/details/[user]",
                      params: { user: item._id } 
                    }}
                  >
                    Ver perfil
                  </Link>
                )}
  
              <Button
                title={item.active ? "Suspender" : "Activar"}
                onPress={() => toggleUserStatus(item._id)}
                color={item.active ? "red" : "green"}
              />

              <Button
                title="Eliminar"
                onPress={() => deleteUser(item._id)}
                color="gray"
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UsersManagement;
