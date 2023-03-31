import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/Homescreen";
import Feed from "../screens/Feed";
import Map from "../screens/Map";
import Addpost from "../screens/Addpost";
import Search from "../screens/Resource";
import CustomMarker from "./CustomMarker";

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
                name="post"
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
                name="map-search"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Addpost"
          component={Addpost}
          options={{
            tabBarLabel: "Addpost",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="note-plus-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="link-box-variant-outline"
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
