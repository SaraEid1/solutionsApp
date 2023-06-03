import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import HomeScreen from "../screens/Homescreen";
import Feed from "../screens/Feed";
import CustomMarker from "./CustomMarker";
import Map from '../screens/Map';
import Addpost from '../screens/Addpost';
import Resources from '../screens/Resource';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      switch (route.name) {
        case 'HomeScreen':
          iconName = focused ? 'home' : 'home-outline';
          break;
        case 'Community Posts':
          iconName = focused ? 'post' : 'post-outline';
          break;
        case 'New Post':
          iconName = focused ? 'note-plus' : 'note-plus-outline';
          break;
        case 'Map':
          iconName = focused ? 'map-search' : 'map-search-outline';
          break;
        case 'Resources':
          iconName = focused ? 'link-box-variant' : 'link-box-variant-outline';
          break;
        default:
          iconName = 'home-outline';
          break;
      }

      return (
        <MaterialCommunityIcons
          name={iconName}
          color={color}
          size={32}
          style={styles.tabIcon}
        />
      );
    },
  });

  const headerOptions = ({ route }) => ({
    headerTitle: () => {
      let headerTitle;

      switch (route.name) {
        case 'HomeScreen':
          headerTitle = 'Home';
          break;
        case 'Community Posts':
          headerTitle = 'Community Posts';
          break;
        case 'New Post':
          headerTitle = 'New Post';
          break;
        case 'Map':
          headerTitle = 'Map';
          break;
        case 'Resources':
          headerTitle = 'Resources';
          break;
        default:
          headerTitle = '';
          break;
      }

      return (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      );
    },
    headerStyle: styles.headerStyle,
    headerTintColor: '#FFFFFF',
    headerTitleAlign: 'center',
    headerTitleStyle: styles.headerTitleStyle,
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          style: styles.tabBarStyle,
          activeTintColor: '#FF5050',
          inactiveTintColor: '#848181',
          showLabel: false,
        }}
        initialRouteName="HomeScreen"
        screenOptions={screenOptions}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={headerOptions}
        />
        <Tab.Screen
          name="Community Posts"
          component={Feed}
          options={headerOptions}
        />

        <Tab.Screen
          name="New Post"
          component={Addpost}
          options={headerOptions}
        />

        <Tab.Screen
          name="Map"
          component={CustomMarker}
          options={headerOptions}
        />

        <Tab.Screen
          name="Resources"
          component={Resources}
          options={headerOptions}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 8,
  },
  tabIcon: {
    marginBottom: -5, // Adjust as needed
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStyle: {
    backgroundColor: '#FF5050',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

export default BottomNavigator;
