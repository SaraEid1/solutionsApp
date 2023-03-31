import { View, Text } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigator from "../components/Bottomnavigator";
import { useRoute } from '@react-navigation/native';


export default function HomeScreen({ route }) {
  const { name } = route.params;
  return (
    <View style={styles.container}>
      <Text>Welcome, {name}!</Text>
    </View>
  );
}
