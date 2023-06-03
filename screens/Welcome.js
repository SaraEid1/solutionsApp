import React, { useEffect } from "react";
import { SafeAreaView, Dimensions, TouchableWithoutFeedback, Image, Text, StyleSheet } from "react-native";

const welcome = require('../assets/welcome.png');

export default function Welcome({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the next screen after 3 seconds
      navigation.navigate("Signin");
    }, 3000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome To</Text>
      <Text style={styles.emphasizedText}>EmpowerHer</Text>
      <Text style={styles.slogan}>Amplifying Voices for Campus Safety</Text>
      
      <Image
        source={welcome}
        style={styles.image}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").width * 0.95,
    resizeMode: "contain",
    marginTop: 22,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 5,
  },
  emphasizedText: {
    color: "#FF7D5C",
    fontWeight: "bold",
    fontSize: 40,
  },
  slogan: {
    fontSize: 20,
    color: "#000000",
    marginBottom: 10,
    fontWeight: "regular",
    marginTop: 10,
    fontFamily: 'Roboto',
  },
});
