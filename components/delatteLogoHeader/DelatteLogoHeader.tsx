import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router"; 

export default function DelatteLogoHeader() {
 
  const handleLogoPress = () => {
    router.replace("/"); 
  };

  return (
    <View style={styles.logoContainer}>
      <TouchableOpacity onPress={handleLogoPress}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 999,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});
