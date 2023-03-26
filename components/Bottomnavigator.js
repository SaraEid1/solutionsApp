import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import Feed from "../screens/Feed";
import Map from "../screens/Map";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//import TopNavigator from "./TopNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        labeled={false}
        initialRouteName="HomeScreen"
        inactiveColor="#ffffff"
        barStyle={{ backgroundColor: "#000000" }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarLabel: "Feed",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="format-list-checks"
                color={color}
                size={26}
              />
            ),
          }}
        />
    </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default BottomNavigator;
