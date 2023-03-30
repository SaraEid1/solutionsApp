import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import firebase from '../firebase';
import {
  // getFirestore,
  collection,
  onSnapshot,
  // addDoc,
  // doc,
  // updateDoc,
  // arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Maps() {
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);




  const extractCoordinates = (data) => {
    const postsWithLocation = data
      .filter((post) => post.location)
      .map((post) => ({
        latitude: post.location.lat,
        longitude: post.location.lng,
        title: post.title,
      }));

    return (postsWithLocation || []);
  };



  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const post = doc.data();
        return {
          id: doc.id,
          ...post,
        };
      });
      // console.log(data)
      const extractedCoordinates = extractCoordinates(data);
      setCoordinates(extractedCoordinates);


    });
    return () => unsubscribe();
  }, []);

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

    if (coordinates.length > 0) {
      const filteredCoords = coordinates.filter((coord) =>
        coord.latitude !== undefined && coord.longitude !== undefined
      );
      // console.log("coords: ", filteredCoords)
      const minLat = Math.min(...filteredCoords.map((coord) => coord.latitude));
      console.log("minlwt ", minLat)
      const maxLat = Math.max(...filteredCoords.map((coord) => coord.latitude));
      const minLng = Math.min(...filteredCoords.map((coord) => coord.longitude));
      const maxLng = Math.max(...filteredCoords.map((coord) => coord.longitude));
      const avgLat = (minLat + maxLat) / 2;
      const avgLng = (minLng + maxLng) / 2;
      const latDelta = Math.abs(maxLat - minLat) * 1.06;
      const lngDelta = Math.abs(maxLng - minLng) * 1.06;
      setInitialRegion({
        latitude: avgLat,
        longitude: avgLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
    }
  }, [coordinates]);



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
      {/* <Button title="Load Posts" onPress={fetchPosts} /> */}
      {location ? (
        <MapView
          style={styles.map}
          // initialRegion={coordinates.length > 0 ? initialRegion : null}
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

          {/* {coordinates && coordinates.length > 0 && coordinates.map((post, index) => (

            <Marker
              key={index}
              coordinate={{
                latitude: post.latitude,
                longitude: post.longitude,
              }}
              title={post.title}
            />
          ) */}


          {/* )} */}

        </MapView>
      ) : (<Text>No Location data available</Text>)}
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