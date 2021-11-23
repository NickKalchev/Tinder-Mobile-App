import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-rn";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const Header = ({ title, call }) => {
  const navigation = useNavigation();

  return (
    <View
      style={tw(
        "p-2 flex-row items-center justify-between top-10 mb-14 border-b-2 border-red-300 rounded-bl-md rounded-br-md"
      )}
    >
      <View style={tw("flex-row items-center -mt-3")}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw("p-2")}
        >
          <Ionicons
            name="chevron-back-outline"
            size={34}
            color="#FF5864"
          />
        </TouchableOpacity>
        <Text
          style={tw("text-2xl font-bold pl-2")}
        >
          {title}
        </Text>
      </View>

      {call && (
        <TouchableOpacity
          style={tw(
            "px-3 py-2 rounded-full -mt-3 mr-4 bg-red-200"
          )}
        >
          <Foundation
            name="telephone"
            size={24}
            color="red"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
