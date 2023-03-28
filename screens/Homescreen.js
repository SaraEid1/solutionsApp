import { View, Text } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigator from "../components/Bottomnavigator";
import { useRoute } from '@react-navigation/native';

export default function HomeScreen(props) {

  const [key, setKey] = useState("home");
  /*const route = useRoute();
  const name = route.params?.name;
  const email = route.params?.email;
*/
  //console.log (props.userInfo.name)
  //console.log (props.userInfo.email)

 // console.log(props.userInfo?.name);
 // console.log(props.userInfo?.email);
  return (
    <View className="flex-1 bg-black">
      <View className="p-4 px-8">
        <Text className="font-extrabold text-[40px] text-white">Hello 👋</Text>
        <Text className="font-extrabold text-[40px] text-white"> Welcome !
 </Text>
      </View>
    </View>
  );

}
