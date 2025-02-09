import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      {/* Sección izquierda con logo y suscripción */}
      <View style={styles.leftSection}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.text}>Suscríbete a nuestro newsletter para recibir novedades cafeteras:</Text>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Ingresa tu email" style={styles.input} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección de enlaces */}
      <View style={styles.rightSection}>
        <View style={styles.column}>
          <Text style={styles.title}>Empresa</Text>
          <Text style={styles.link}>Nosotros</Text>
          <Text style={styles.link}>Cafeterías</Text>
          <Text style={styles.link}>Blog</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.title}>Soporte</Text>
          <Text style={styles.link}>Ayuda</Text>
          <Text style={styles.link}>Contacto</Text>
          <Text style={styles.link}>Términos & Condiciones</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.title}>Redes Sociales</Text>
          <Text style={styles.link}>Instagram</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: "#EAD7C1",
      paddingVertical: 30,
      paddingHorizontal: 40, // Aumentar un poco el padding para mejor distribución
      flexDirection: "row",
      justifyContent: "space-around", // Reduce el espacio entre secciones
      alignItems: "flex-start",
    },
    leftSection: {
      width: "45%", // Reduce el ancho para acercarlo más a la rightSection
    },
    rightSection: {
      width: "40%", // Reduce el ancho para evitar separación excesiva
      flexDirection: "row",
      justifyContent: "space-between", // Separa mejor las columnas
    },
    column: {
      marginHorizontal: 10, 
      marginBottom: 20,
    },
    logo: {
      width: 100,
      height: 35,
      resizeMode: "contain",
      marginBottom: 20,
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      color: "#6B4226",
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 40,
      width: "100%",
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: "#6B4226",
    },
    button: {
      backgroundColor: "#6B4226",
      width: 35,
      height: 35,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    arrow: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#6B4226",
      marginBottom: 20,
      marginTop: 20,
    },
    link: {
      fontSize: 14,
      color: "#6B4226",
      marginBottom: 20,
    },
  });
  