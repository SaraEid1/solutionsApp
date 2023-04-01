import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import firebase from '../firebase';
import {
  collection,
  onSnapshot,
  where,
  query
} from "firebase/firestore";
import { db } from "../firebase";
import LottieView from 'lottie-react-native'

export default function Maps() {
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [region, setRegion] = useState(null);
  const [mapLayout, setMapLayout] = useState(null);
  const [zoomLevel] = useState(0.06);
  const [visibleCoordinates, setCurrentCoordinates] = useState([]);


  const handleRegionChange = (region) => {
    setCurrentCoordinates(region);
  }

  const reverseGeocode = async () => {
    if (location) {
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let formattedAddress = `${result.name}, ${result.street}, ${result.city}`;
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
        <Text category={"h6"}>Loading</Text>
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
      <View>

        {location ? (
          <MapView

            style={{ height: '100%' }} // add minHeight style

            initialRegion={region || {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
              latitudeDelta: zoomLevel,
              longitudeDelta: zoomLevel,
            }}

            onLayout={(event) => setMapLayout(event.nativeEvent.layout)}

            onRegionChangeComplete={handleRegionChange}
          >

            {mapLayout && location && (

              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title={address}
                pinColor={'blue'}
                opacity={0.85}
              />

            )}



          </MapView>) :

          (<View style={styles.mapPlaceholder} />)

        }

      </View>

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