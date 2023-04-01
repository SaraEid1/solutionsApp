import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from "../firebase";
import {

    collection,
    onSnapshot,

} from "firebase/firestore";
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native'


const CustomMarker = () => {
    console.log("inside the function")
    const [region, setRegion] = useState(null);
    const [data, setData] = useState([])

    // const [selectedLocation, setSelectedLocation] = useState(null);
    const [userLocation, setuserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapLayout, setMapLayout] = useState(null);

    // ask for userpermision
    useEffect(() => {
        console.log("Requesting user permission...");

        async function requestLocationPermission() {
            const status = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                
                return;
            }

            console.log("Fetching user location...");
            const location = await Location.getCurrentPositionAsync({});
            setuserLocation(location);
            setIsLoading(false);
        }

        requestLocationPermission();
    }, []);




    console.log("line 26")
    // get location from firebase 
    useEffect(() => {
        console.log("inside useffect")
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const post = doc.data();
                console.log("POST", post)

                if ("location" in post && "address" in post) {
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
            setData(data);
            console.log("DATA ", data)
        });
        return () => unsubscribe();
    }, []);


    // Get address from user location
    console.log("line 59")


    useEffect(() => {

        const reverseGeocode = async () => {
            console.log(" inside reverse geo")
            if (userLocation) {
                const [result] = await Location.reverseGeocodeAsync({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                });

                let formattedAddress = `${result.name}, ${result.street}, ${result.city}`;
                setAddress(formattedAddress);
            }
        };

        reverseGeocode();
    }, [userLocation]);






    // Uses region to filter out displayed points from database

    const filterMarkers = () => {
        // console.log("original data:", data);
        const { latitude: regionLat, longitude: regionLng, latitudeDelta, longitudeDelta } = region || {
            latitude: 40.7128,
            longitude: -74.006,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };;
        console.log("REGION ", region)

        const filteredLocations = data.map((marker) => marker.location)
            .filter((location) => {
                console.log("LOCATION ", location)
                // const { latitude, longitude } = location;
                const latitude = location.lat
                const longitude = location.lng
                console.log("LATITUDE ", latitude)

                const latWithinBounds = latitude >= (regionLat - latitudeDelta / 2) && latitude <= (regionLat + latitudeDelta / 2);
                const lngWithinBounds = longitude >= (regionLng - longitudeDelta / 2) && longitude <= (regionLng + longitudeDelta / 2);
                return latWithinBounds && lngWithinBounds;
            });

        console.log("filtered Locations: ", filteredLocations);
        return filteredLocations;
    };

    const handleRegionChange = (newRegion) => {
        setRegion(newRegion);
        // console.log('Map range:', newRegion);
    };




    const markersToShow = filterMarkers();



    // Codeto fetch and store userLocation 
    useEffect(() => {
        const getUserLocation = async () => {
            try {
                console.log("Requesting user permission for location...")
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                console.log("Getting user's current location...")
                const location = await Location.getCurrentPositionAsync({});
                console.log("USER LOCATION: ", location)
                setuserLocation(location);
                setIsLoading(false);
            } catch (error) {
                console.error("Error while getting user location: ", error)
                console.error("Error while getting user location")
            }
        }

        getUserLocation();
    }, []);

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

            {userLocation ? (
                <MapView


                    // add minHeight style
                    style={{ height: '100' }}

                    initialRegion={region || {
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                        // latitudeDelta: zoomLevel,
                        // longitudeDelta: zoomLevel,
                    }}

                    onLayout={(event) => setMapLayout(event.nativeEvent.layout)}

                    onRegionChangeComplete={handleRegionChange}
                >

                </MapView>) : (<View style={styles.mapPlaceholder} />)}


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
        flex: 1,
    },
});

export default CustomMarker;



{/* user Marker */ }
{/* {mapLayout && userLocation && (

                        <Marker
                            coordinate={{
                                latitude: userLocation.coords.latitude,
                                longitude: userLocation.coords.longitude,
                            }}
                            title={address}
                            pinColor={'blue'}
                            opacity={0.85}
                        />

                    )} */}
{/* {mapLayout && userLocation && markersToShow.map((coordinate, index) => {

                        return (
                            <Marker
                                key={`${coordinate.lat}-${coordinate.lng}-${index}`}
                                coordinate={{ latitude: coordinate.lat, longitude: coordinate.lng }}
                                title={coordinate.address}



                            />
                        );
                    })} */}