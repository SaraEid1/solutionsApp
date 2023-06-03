import React, { useEffect, useState } from "react";
import { SafeAreaView, Dimensions, TouchableWithoutFeedback } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
import LottieView from "lottie-react-native";

export default function Splash1({ navigation }) {
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

  const navigateToHome = () => {
    navigation.navigate("Home");
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
            <Animated.View key={index} style={[styles.dot]} />
          );
        })}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={navigateToHome}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <LottieView
            autoPlay
            loop
            style={styles.logo}
            source={require("../assets/s1.json")}
          />
        </View>
        <Text style={styles.description}>
          Stay informed and supported with EmpowerHer. Access real-time alerts and a wealth of resources tailored to your needs.
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
    marginBottom: 30,
  },
  logo: {
    width: 220,
    height: 220,
  },
  description: {
    fontSize: 20,
    marginBottom: 25,
    marginTop: 15,
    textAlign: "center",
    color: "#000000",
    paddingHorizontal: 20,
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
    marginHorizontal: 6,
    backgroundColor: "#ff5a5f",
  },
  selectedDot: {
    backgroundColor: "#ff5a5f", // Change the color of the selected dot if needed
  },
});
