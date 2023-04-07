import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Homescreen";
import Signin from "./screens/Signin";
import Addpost from "./screens/Addpost";
import Location from "./screens/Location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavigator from "./components/Bottomnavigator";
import { Platform } from 'react-native';
//import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

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


  /*
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


  useEffect (() => {
    if (requestUserPermission()){
      messaging().getToken().then (token => {
        console.log (token);
      })
    }
    else {
      console.log ("Failed token status", authStatus)
    }

 // Check whether an initial notification is available
 messaging()
 .getInitialNotification()
 .then(async (remoteMessage) => {
   if (remoteMessage) {
     console.log(
       'Notification caused app to open from quit state:',
       remoteMessage.notification,
     );
   }
 });

 // Assume a message-notification contains a "type" property in the data payload of the screen to open

 messaging().onNotificationOpenedApp(async (remoteMessage) => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
});

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const unsubscribe = messaging().onMessage(async remoteMessage => {
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

return unsubscribe;


}, []);
*/

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
          name="Location"
          component={Location}
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

