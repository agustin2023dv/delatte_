import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { requestPasswordResetService } from "@/services/shared/auth/password.service";
import DelatteLogoHeader from "@/components/delatteLogoHeader/DelatteLogoHeader";


function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return re.test(String(email).toLowerCase());
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Enviando solicitud para:", email);
      await requestPasswordResetService(email);

      setSuccessMessage("Hemos enviado un enlace de restablecimiento a tu correo.");
      setEmail("");
    } catch (err: any) {
      console.error("Error en el proceso:", err);
      setError(err.message || "Error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
    <DelatteLogoHeader />
      <View style={styles.container}>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.instructions}>
          Ingresa tu correo electrónico para recibir un enlace de restablecimiento.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#a5744b" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Enviar enlace</Text>
          </TouchableOpacity>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#e7ded9", 
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat-Bold",
    color: "#271207",
    marginRight: 10,
    padding: 20,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#271207",
    marginBottom: 20,
    textAlign: "center",
    width: "80%",
    maxWidth: 500,
  },
  input: {
    width: "35%",
    maxWidth: 300,
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
    width: "35%",
    maxWidth: 300,
    backgroundColor: "#a5744b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginTop: 10,
    width: "80%",
    maxWidth: 500,
  },
  successText: {
    color: "green",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginTop: 10,
    width: "80%",
    maxWidth: 500,
  },
});
