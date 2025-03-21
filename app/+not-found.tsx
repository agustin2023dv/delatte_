import DelatteLogoHeader from "@/components/delatteLogoHeader/DelatteLogoHeader";
import { Link, Stack } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeContainer}>
    <DelatteLogoHeader />
      <Stack.Screen options={{ title: "Página no encontrada" }} />
      <View style={styles.container}>
        <Text style={styles.title}>¡Oops!</Text>
        <Text style={styles.subtitle}>Esta pantalla no existe.</Text>
        <Text style={styles.message}>
          Lo sentimos, no hemos encontrado la ruta que estás buscando.
        </Text>
        <Link href="/" style={styles.button}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </Link>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    color: "#271207",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#271207",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#271207",
    textAlign: "center",
    marginBottom: 24,
    width: "80%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#a5744b",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
