import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { API_KEY } from '@env';

const Map = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
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

  const uri = `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${latitude},${longitude}&zoom=15`;

  return (
    <View style={styles.container}>
      {latitude && longitude ? (
        <WebView source={{ uri }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;
