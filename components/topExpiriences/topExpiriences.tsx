import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

const experiences = [
  {
    id: "1",
    image: require("../../assets/images/experience1.png"),
    rating: "5.0",
  },
  {
    id: "2",
    image: require("../../assets/images/experience2.png"),
    rating: "5.0",
  },
  {
    id: "3",
    image: require("../../assets/images/experience3.png"),
    rating: "5.0",
  },
  {
    id: "4",
    image: require("../../assets/images/experience4.png"),
    rating: "5.0",
  },
];

export default function TopExperiences() {
  return (
    <View style={styles.container}>
      {/* Encabezado con Logo */}
      <View style={styles.header}>
        <Text style={styles.title}>Las mejores experiencias en</Text>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      </View>

      {/* Lista de Experiencias */}
      <FlatList
        data={experiences}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.stars}>★★★★★</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F7EBE1",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#6B4226",
    marginRight: 8,
  },
  logo: {
    width: 80,
    height: 30,
    resizeMode: "contain",
  },
  card: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  image: {
    width: 200,
    height: 170,
    borderRadius: 8,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    backgroundColor: "#FFC107",
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  stars: {
    fontSize: 14,
    color: "#FFC107",
  },
});
