import React from "react";
import { SafeAreaView, StyleSheet, Image, ScrollView, View } from "react-native";
import SearchBar from "@/components/search/SearchBar";
import NavBar from "@/components/navbar/navbar";
import Categories from "@/components/categories/categories";
import Discoveries from "components/discoveries/discoveries";
import AboutUs from "@/components/aboutUs/aboutUs"; // Nuevo componente

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <NavBar />
        <SearchBar />
        <Categories />
        <Discoveries />

        {/* Contenedor para fusionar los granos de café entre Discoveries y AboutUs */}
        <View style={styles.beansContainer}>
          <Image
            source={require("../../assets/images/beans.png")}
            style={[styles.beansImage, styles.beansLeft]}
          />
          <Image
            source={require("../../assets/images/beans.png")}
            style={[styles.beansImage, styles.beansRight]}
          />
        </View>

        {/* Contenedor ajustado para que AboutUs no quede pegado a Beans */}
        <View style={styles.aboutUsWrapper}>
          <AboutUs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F7EBE1",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  beansContainer: {
    position: "relative",
    width: "100%",
    height: 140, 
    marginTop: -50, 
    overflow: "visible",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
  },
  beansImage: {
    width: "40%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: 0,
  },
  beansLeft: {
    left: -50,
  },
  beansRight: {
    right: -50,
  },
  aboutUsWrapper: {
    marginTop: -30, 
    paddingTop: 50, 
    zIndex: 1, 
  },
});
