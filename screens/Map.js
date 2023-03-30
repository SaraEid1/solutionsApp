import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';



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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
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
      )}
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
});
