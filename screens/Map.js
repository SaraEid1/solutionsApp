import { View, Text } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigator from "../components/Bottomnavigator";
import MapView, { Marker } from 'react-native-maps';
export default function Map() {

  const [key, setKey] = useState("map");

  return (
    <View className="flex-1 bg-black">
      <Text>hi</Text>
    </View>
  );

}
