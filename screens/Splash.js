import React, { useEffect, useState } from "react";
import { SafeAreaView, Dimensions, TouchableWithoutFeedback } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
import LottieView from "lottie-react-native";

export default function Splash({ navigation }) {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", updateScreenWidth);

    return () => {
      Dimensions.removeEventListener("change", updateScreenWidth);
    };
  }, []);

  const navigateToSplash1 = () => {
    navigation.navigate("Splash1"); // Replace "Splash1" with the actual route name of Splash1 screen
  };

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, screenWidth);
    return (
      <View style={styles.dotsContainer}>
        {[...Array(2)].map((_, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View key={index} style={[styles.dot, { opacity }]} />
          );
        })}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={navigateToSplash1}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <LottieView
            autoPlay
            loop
            style={styles.logo}
            source={require("../assets/t.json")}
          />
          <Text style={styles.title}>EmpowerHer</Text>
        </View>
        <Text style={styles.description}>
          An empowering platform to share your experiences anonymously and find solace in a community of like-minded individuals. Unleash your voice, connect with supportive peers, and foster a sense of belonging.
        </Text>
        {renderDots()}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000000",
  },
  description: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
    color: "#000000",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#ff5a5f",
    marginHorizontal: 6,
  },
});
