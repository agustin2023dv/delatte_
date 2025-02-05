import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginCustomer from "./LoginCustomer";
import LoginManager from "./LoginManager";

const Tab = createMaterialTopTabNavigator();

export default function LoginTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#e7ded9" },
        tabBarIndicatorStyle: { backgroundColor: "#a5744b" },
        tabBarLabelStyle: {
          fontFamily: "Montserrat-Bold",
          color: "#271207",
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen name="Cliente" component={LoginCustomer} />
      <Tab.Screen name="Manager" component={LoginManager} />
    </Tab.Navigator>
  );
}
