import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LottieView from "lottie-react-native";

export default function Maps() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);

  const reverseGeocode = async () => {
    if (location) {
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let formattedAddress = `${result.name}, ${result.street}, ${result.postalCode}, ${result.city}, ${result.region}`;
      setAddress(formattedAddress);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    reverseGeocode();
  }, [location]);

  if (isLoading) {
    return (
     
      <View style={styles.container}>
         <Text  category={"h6"}>Loading</Text>
         <LottieView
                    autoPlay
                    loop
                    style={styles.lottie}
          source={require("../assets/Loading.json")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
          />
        )}
      </MapView>
      {address && <Text style={styles.address}>{address}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  lottie: {
    flex: 1,
    alignSelf: 'center',
  },
});
