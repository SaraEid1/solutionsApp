import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/Homescreen";
import Feed from "../screens/Feed";


import CustomMarker from "./CustomMarker";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import Map from '../screens/Map';
import Addpost from '../screens/Addpost';
import Resources from '../screens/Resource';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          style: styles.tabBarStyle,
          showLabel: false
        }}
        initialRouteName="HomeScreen"
      >
        <Tab.Screen
          name=" "
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="home" color={focused ? '#FF7D5C' : '#7A7A7A'} size={focused ? 40 : 26} />
            ),
          }}
        />
        <Tab.Screen
          name="Community Posts"
          component={Feed}
          
          options={{
            headerStyle: {
            },
            headerTitleStyle: {
              fontSize: 32,
              fontWeight: 'semibold',
              marginTop: 18,
            },
            headerTitleAlign: "center",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="post" color={focused ? '#FF7D5C' : '#7A7A7A'} size={focused ? 40 : 26} />
            ),
          }}
        />

        <Tab.Screen
          name="New Post"
          component={Addpost}
          options={{
            headerStyle: {
            },
            headerTitleStyle: {
              fontSize: 32,
              fontWeight: 'semibold',
              marginTop: 18,
            },
            headerTitleAlign: "center",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="note-plus-outline" color={focused ? '#FF7D5C' : '#7A7A7A'} size={focused ? 40 : 26} />
            ),
          }}
        />

        <Tab.Screen
          name="Map"
          component={CustomMarker}
          options={{
            headerStyle: {
            },
            headerTitleStyle: {
              fontSize: 32,
              fontWeight: 'semibold',
              marginTop: 18,
            },
            headerTitleAlign: "center",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="map-search" color={focused ? '#FF7D5C' : '#7A7A7A'} size={focused ? 40 : 26} />
            ),
          }}
        />



        <Tab.Screen
          name="Resources"
          component={Resources}
          options={{
            headerStyle: {
            },
            headerTitleStyle: {
              fontSize: 32,
              fontWeight: 'semibold',
              marginTop: 20,
            },
            headerTitleAlign: "center",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="link-box-variant-outline" color={focused ? '#FF7D5C' : '#7A7A7A'} size={focused ? 40 : 26} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  tabBarStyle: {
    backgroundColor: '#000000',
  }
});

export default BottomNavigator;
