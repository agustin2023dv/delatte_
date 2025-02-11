import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import ProfileTabs from "./ProfileTabs";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function CustomerProfile() {
  const { isSigned } = useAuth();

  useEffect(() => {
    if (!isSigned) {
      router.replace("/(auth)/login"); // Redirige a login si no está autenticado
    }
  }, [isSigned]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text onPress={() => router.replace("/home")}>Volver a Home</Text>
      <ProfileTabs />
    </SafeAreaView>
  );
}
