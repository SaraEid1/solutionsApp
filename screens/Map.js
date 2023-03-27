import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigator from "../components/Bottomnavigator";
import { API_KEY } from "@env";

const Map = () => {
  const { width, height } = Dimensions.get('window');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  if (Platform.OS === 'web') {
    // Render Map component for web
    return <MapComponent latitude={latitude} longitude={longitude} apiKey={API_KEY} />;
  }

  // Render WebView for mobile platforms
  const uri = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&output=embed&key=${API_KEY}`;

  return (
    <View style={styles.container}>
      {latitude && longitude ? (
        <WebView
          source={{ uri }}
          style={{ width, height }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const MapComponent = ({ latitude, longitude, apiKey }) => {
  // Implement Map component for web
  return <div>{`Map Component for ${latitude},${longitude} using API key: ${apiKey}`}</div>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;
