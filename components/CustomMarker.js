import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../firebase";
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import LottieView from 'lottie-react-native'

const CustomMarker = () => {
    const [region, setRegion] = useState(null);
    const [data, setData] = useState([])
    const initialRegion = {
        latitude: 49.2827291,
        longitude: -123.1207375,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    // const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);




    // get location from firebase 
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const post = doc.data();

                if ("location" in post && "address" in post["location"]) {
                    // console.log("ADDRESS", address)
                    return {
                        location: post["location"],
                        address: post["address"]

                    }
                }


                else if ("location" in post) {
                    return {
                        // id: doc.id,
                        location: post["location"],
                    };
                } else {
                    return null;
                }
            }).filter((post) => post !== null);
            setIsLoading(false);
            setData(data);
            // console.log("DATA ", data)
        });
        return () => unsubscribe();
    }, []);





    // without geocodeing 

    const filterMarkers = () => {
        // console.log("original data:", data);
        const { latitude: regionLat, longitude: regionLng, latitudeDelta, longitudeDelta } = region || initialRegion;

        const filteredLocations = data.map((marker) => marker.location)
            .filter((location) => {
                // console.log("LOCATION ", location)
                // const { latitude, longitude } = location;
                const latitude = location.lat
                const longitude = location.lng
                // console.log("LATITUDE ", latitude)

                const latWithinBounds = latitude >= (regionLat - latitudeDelta / 2) && latitude <= (regionLat + latitudeDelta / 2);
                const lngWithinBounds = longitude >= (regionLng - longitudeDelta / 2) && longitude <= (regionLng + longitudeDelta / 2);
                return latWithinBounds && lngWithinBounds;
            });

        // console.log("filtered Locations: ", filteredLocations);

        return filteredLocations;
    };

    const handleRegionChangeComplete = (newRegion) => {
        setRegion(newRegion);
        // console.log('Map range:', newRegion);
    };




    const markersToShow = filterMarkers();

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

            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
            >
                {markersToShow.map((coordinate, index) => {
                    console.log(coordinate.address)

                    return (

                        <Marker
                            key={`${coordinate.lat}-${coordinate.lng}-${index}`}
                            coordinate={{ latitude: coordinate.lat, longitude: coordinate.lng }}
                            title={coordinate.address}

                        />
                    );
                })}
            </MapView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default CustomMarker;
