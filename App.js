import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Homescreen";
import Signin from "./screens/Signin";
import Addpost from "./screens/Addpost";
import Splash from "./screens/Splash";
import BottomNavigator from "./components/Bottomnavigator";
import Feed from "./screens/Feed";
import Splash1 from "./screens/Splash1";
import * as Font from 'expo-font';
import React, { useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        // Add other font weights and styles as needed
      });
    }

    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Addpost"
          component={Addpost}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Splash1"
          component={Splash1}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
