import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// Array de cafeterías “destacadas” (ejemplo)
const discoveries = [
  {
    id: 1,
    title: "Cafetería El Rincón",
    image: require("../../assets/images/test1.png"),
    desc: "Un ambiente rústico y la mejor repostería artesanal.",
  },
  {
    id: 2,
    title: "Coffee & Co.",
    image: require("../../assets/images/test2.png"),
    desc: "Especialistas en café de origen y desayunos saludables.",
  },
  {
    id: 3,
    title: "Latte Lovers",
    image: require("../../assets/images/test3.png"),
    desc: "Espacios modernos para disfrutar de un buen latte.",
  },
];

export default function Discoveries() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Descubrimientos del mes</Text>
      
      <View style={styles.row}>
        {discoveries.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>
              {item.desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F7EBE1",
    alignItems: "center",
    paddingVertical: 40,
    position: "relative",
  },
  title: {
    fontSize: 20,
    color: "#6B4226",
    fontFamily: "Montserrat-Bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap", 
  },
  item: {
    width: width * 0.26, 
    alignItems: "center",
    marginBottom: 20, 
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 6,
    marginBottom: 8,
  },
  itemTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#6B4226",
    marginBottom: 4,
  },
  itemDesc: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#6B4226",
    textAlign: "center",
    paddingHorizontal: 4, // margen lateral
  },
}); 