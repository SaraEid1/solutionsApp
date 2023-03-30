import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextField,
  Button,
  ScrollView,
} from "react-native";
import { db } from "../firebase";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
  
  } from "firebase/firestore";

export default function Markers() {
    const [posts, setPosts] = useState([[]])
    const [locations, setLocations] = useState([]) 



    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const post = doc.data();
          
            return {
              id: doc.id,
              ...post,
            };
          });
            setPosts(data);
            console.log(posts)
        });
        return () => unsubscribe();
      }, []);


    
}

// const reverseGeocode = async () => {
//     if (location) {
//       const [result] = await Location.reverseGeocodeAsync({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       let formattedAddress = `${result.name}, ${result.street}, ${result.postalCode}, ${result.city}, ${result.region}`;
//       setAddress(formattedAddress);
//     }
//   };

useEffect(() => {
    
})