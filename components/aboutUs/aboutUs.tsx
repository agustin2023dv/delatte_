import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function AboutUs() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestros comienzos</Text>
      <Text style={styles.text}>
        Delatte nació con la pasión por el café y la necesidad de descubrir
        lugares únicos. Queremos ayudarte a encontrar las mejores cafeterías,
        desde espacios clásicos hasta modernos coffee shops de especialidad.
      </Text>
      <Text style={styles.text}>
        Acompáñanos en este viaje cafetero y explora nuevas experiencias en
        cada rincón.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sobre nosotros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#EAD7C1", 
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: width * 0.1, 
    position: "relative",
    marginTop: -80, 
    zIndex: 1, 
  },
  title: {
    fontSize: 22,
    color: "#6B4226",
    fontFamily: "Montserrat-Bold",
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#6B4226",
    textAlign: "center",
    marginBottom: 40,
    width: "60%",
  },
  button: {
    backgroundColor: "#6B4226",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
  },
});
