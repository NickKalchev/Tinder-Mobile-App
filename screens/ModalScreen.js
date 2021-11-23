import {
  doc,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import React, {
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-rn";
import logo from "../assets/modal.png";
import { db } from "../fireebase";
import useAuth from "../hooks/useAuth";

const ModalScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  const updateUser = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job,
      age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View
      style={tw(
        "flex-1 items-center pt-4 bg-white"
      )}
    >
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={logo}
      />
      <Text
        style={tw(
          "text-xl text-gray-500 p-2 font-bold mb-2"
        )}
      >
        Welcome {user.displayName}
      </Text>

      <Text
        style={tw(
          "text-center text-red-400 text-lg p-4 font-bold"
        )}
      >
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter a profile picture URL"
      />

      <Text
        style={tw(
          "text-center text-red-400 text-lg p-4 font-bold"
        )}
      >
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your occupation"
        maxLength={41}
      />

      <Text
        style={tw(
          "text-center text-red-400 text-lg p-4 font-bold"
        )}
      >
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your age"
        keyboardType="numeric"
        maxLength={2}
      />

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw(
            "w-64 rounded-xl p-3 bg-red-400 absolute bottom-10"
          ),
          incompleteForm
            ? tw("bg-gray-400")
            : tw("bg-red-400"),
        ]}
        onPress={updateUser}
      >
        <Text
          style={tw(
            "text-center text-white text-xl font-bold"
          )}
        >
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
