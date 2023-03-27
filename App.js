import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Signin from "./screens/Signin";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavigator from "./components/Bottomnavigator";

const Stack = createNativeStackNavigator();

function HeaderTitle({ navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginRight: 15,
        backgroundColor: "black",
        marginTop: 10,
        padding: 10,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          borderRadius: 100,
          backgroundColor: "#333333",
          padding: 10,
        }}
      >
        <MaterialCommunityIcons
          name="home"
          size={30}
          color="#ffffff"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

