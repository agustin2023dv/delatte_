import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";
import ReservationsTab from "./ReservationsTab";
import AccountSettings from "./AccountSettingsTab";

const Tab = createMaterialTopTabNavigator();

export default function ProfileTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar, 
        tabBarIndicatorStyle: styles.indicator, 
        tabBarLabelStyle: styles.label, 
        tabBarActiveTintColor: "#6B4226", 
        tabBarInactiveTintColor: "#A58D7F", 
      }}
    >
      <Tab.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{ title: "Información de la cuenta" }}
      />
      <Tab.Screen
        name="ReservationsTab"
        component={ReservationsTab}
        options={{ title: "Mis Reservas" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#F7EBE1", 
    elevation: 3, 
    shadowOpacity: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D6D1",
  },
  indicator: {
    backgroundColor: "#6B4226", 
    height: 3, 
    borderRadius: 2,
  },
  label: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    textTransform: "none",
  },
});
