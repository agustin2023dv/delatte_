
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, 
  Modal, TextInput, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { changePasswordService } from '@/services/shared/auth/password.service';
import { fetchUserDataService } from '@/services/customer/user/profile.service';

interface UserData {
  nombre: string;
  email: string;
  dob: string;
  phone: string;
  addresses: Array<string>; 
  profileImage: string;
}


//**Componente para la configuración de la cuenta del usuario**
export default function AccountSettings() {
  const  user  = useAuth(); // Obtener el usuario autenticado del contexto

  // Estados para manejar el modal de cambio de contraseña
  const [isModalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 

  const [error, setError] = useState<string | null>(null);  
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserDataService();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'Error inesperado');
      }
    };
    fetchData();
  }, []);

  if (!userData) {
    return <Text>Cargando...</Text>; 
  }

  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    try {
      await changePasswordService(oldPassword, newPassword, confirmNewPassword);
      Alert.alert('Éxito', 'La contraseña ha sido cambiada con éxito');
      setModalVisible(false); // Cerrar el modal después del cambio exitoso
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  const handleToggle2FA = () => {
    Alert.alert("Autenticación de Dos Factores", 
      "Función para activar/desactivar 2FA."); // Función para activar/desactivar 2FA
  };

  const handleDisconnect = (platform: string) => {
    console.log(`Desconectar cuenta de ${platform}`); // Función para desconectar cuentas vinculadas
  };

  const handleConnect = (platform: string) => {
    console.log(`Conectar cuenta de ${platform}`); // Función para conectar cuentas vinculadas
  };

  // Estado de las cuentas conectadas 
  const connectedAccounts = {
    google: true,
    facebook: false,
    twitter: true,
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Información de la cuenta */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información personal</Text>
                <Image 
                    source={{ uri: userData.profileImage ? userData.profileImage : 'https://via.placeholder.com/100' }} 
                    style={styles.profileImage} 
                  />
                <Text style={styles.info}>Nombre: {userData.nombre}</Text>
                <Text style={styles.info}>Email: {userData.email}</Text>
              
              <Text style={styles.info}>
              Fecha de nacimiento: {selectedDate ? selectedDate.toDateString() : userData.dob}
              </Text>
          
              <Text style={styles.info}>Télefono: {userData.phone}</Text>
            </View>

            {/* Lista de direcciones */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Direcciones</Text>
                {userData.addresses.length > 0 ? (
                  userData.addresses.map((address, index) => (
                    <Text key={index} style={styles.info}>
                      . {address}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.info}>No hay direcciones disponibles</Text>
                )}
              </View>

            {/* Sección de seguridad */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seguridad</Text>

                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                  <Text style={styles.buttonText}>Cambiar contraseña</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleToggle2FA}>
                  <Text style={styles.buttonText}>2-Step Verification</Text>
                </TouchableOpacity>
                
              </View>

            {/* Sección de cuentas conectadas */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connected Accounts</Text>
                {/* Cuentas conectadas */}
                {Object.entries(connectedAccounts).map(([platform, isConnected]) => (
                  <View key={platform} style={styles.account}>
                    <Text>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                    <TouchableOpacity
                      style={isConnected ? styles.disconnectButton : styles.connectButton}
                      onPress={() =>
                        isConnected ? handleDisconnect(platform) : handleConnect(platform)
                      }
                    >
                      <Text style={styles.buttonText}>
                        {isConnected ? 'Disconnect' : 'Connect'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            {/* Modal para cambiar la contraseña */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Cambiar Contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña Actual"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nueva Contraseña"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Nueva Contraseña"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleChangePassword}>
                      <Text style={styles.buttonText}>Cambiar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        
      </SafeAreaView>
      
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: "85%", 
    maxWidth: 380, 
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4226",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#A58D7F",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: "#FFF8F2",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20, 
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5, 
  },
  confirmButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#F7EBE1",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 600, 
    alignSelf: "center",
    backgroundColor: "#FFF8F2",
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  section: {
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C9A6",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6B4226",
    marginBottom: 12,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    alignSelf: "center",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#6B4226",
  },
  info: {
    fontSize: 16,
    color: "#4A3B30",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6B4226",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  account: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF8F2",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  connectButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disconnectButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
 
});
