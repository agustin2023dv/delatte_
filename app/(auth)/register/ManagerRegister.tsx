import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  validateApellido,
  validateNombre,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRestaurantName,
  validateRestaurantPostCode,
  validateRestaurantAddress,
} from "@/shared/utils/auth.validation";
import { createRestaurantAndManagerService } from "@/services/restaurant.service";

export default function ManagerRegister() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantPostCode, setRestaurantPostCode] = useState("");
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setErrorMessages(null);

    // Validaciones de los campos
    const errors: string[] = [];
    const addError = (error: string | null) => {
      if (error) errors.push(error);
    };

    addError(validateNombre(nombre));
    addError(validateApellido(apellido));
    addError(validateEmail(email));
    addError(validatePassword(password));
    addError(validateConfirmPassword(password, cPassword));
    addError(validateRestaurantName(restaurantName));
    addError(validateRestaurantAddress(restaurantAddress));
    addError(validateRestaurantPostCode(restaurantPostCode));

    if (errors.length > 0) {
      setErrorMessages(errors.join("\n"));
      return;
    }

    setLoading(true);
    try {
      // Crear el objeto con los datos del manager y el restaurante
      const managerData = {
        nombre,
        apellido,
        email,
        password,
      };

      const restaurantData = {
        nombre: restaurantName,
        direccion: restaurantAddress,
        codigoPostal: restaurantPostCode,
      };

      // Llamar al servicio para registrar el manager y el restaurante
      await createRestaurantAndManagerService(restaurantData, managerData);

      Alert.alert(
        "Registro Exitoso",
        "Tu restaurante y cuenta de manager han sido creados correctamente."
      );
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Error en el registro:", error);
      setErrorMessages(
        error?.response?.data?.message || "No se pudo completar el registro."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registra tu negocio</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirma la contraseña"
          value={cPassword}
          onChangeText={setCPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre del Restaurante"
          value={restaurantName}
          onChangeText={setRestaurantName}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección del Restaurante"
          value={restaurantAddress}
          onChangeText={setRestaurantAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Código Postal"
          value={restaurantPostCode}
          onChangeText={setRestaurantPostCode}
        />

        {errorMessages ? (
          <Text style={styles.errorText}>{errorMessages}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#e7ded9" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Montserrat-Bold",
    color: "#271207",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  button: {
    backgroundColor: "#a5744b",
    paddingVertical: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },
  errorText: {
    color: "red",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginTop: 10,
  },
});
