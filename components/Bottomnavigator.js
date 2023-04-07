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
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      let iconName;

      switch (route.name) {
        case 'HomeScreen':
          iconName = 'home';
          break;
        case 'Community Posts':
          iconName = 'post';
          break;
        case 'New Post':
          iconName = 'note-plus-outline';
          break;
        case 'Map':
          iconName = 'map-search';
          break;
        case 'Resources':
          iconName = 'link-box-variant-outline';
          break;
        default:
          iconName = 'home';
          break;
      }

      return (
        <MaterialCommunityIcons
          name={iconName}
          color={focused ? '#FF7D5C' : '#7A7A7A'}
          size={focused ? 40 : 26}
        />
      );
    },
    headerShown: false,
    headerStyle: {
    },
    headerTitleStyle: {
      fontSize: 32,
      fontWeight: 'semibold',
      marginTop: 18,
    },
    headerTitleAlign: "center",
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          style: styles.tabBarStyle,
          showLabel: false
        }}
        initialRouteName="HomeScreen"
        screenOptions={screenOptions}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="Community Posts" component={Feed} />
        <Tab.Screen name="New Post" component={Addpost} />
        <Tab.Screen name="Map" component={CustomMarker} />
        <Tab.Screen name="Resources" component={Resources} />
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
