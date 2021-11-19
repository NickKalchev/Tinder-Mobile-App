import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import {
  AntDesign,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";

const DUMMY_DATA = [
  {
    firstName: 'Elon',
    lastName: 'Musk',
    occupation: 'Software Genius and XSpace owner',
    photoURL: 'https://citaty.net/media/authors/elon-musk_hP29QNM.jpeg',
    age: 45,
    id: 1
  },
  {
    firstName: 'Nick',
    lastName: 'Kalchev',
    occupation: 'Software Developer',
    photoURL: 'https://media-exp1.licdn.com/dms/image/C5603AQGrjA0HbL0VYA/profile-displayphoto-shrink_800_800/0/1589376925679?e=1642636800&v=beta&t=DLp7QeTtw_1rAv3VK8uewjfz4Hp7YV4h8rRWbfA7n0E',
    age: 28,
    id: 2
  },{
    firstName: 'Elon',
    lastName: 'Musk',
    occupation: 'Software Genius and XSpace owner',
    photoURL: 'https://citaty.net/media/authors/elon-musk_hP29QNM.jpeg',
    age: 45,
    id: 3
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logOut, user } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={tw('flex-1')}>
      {/* Header */}
      <View
        style={tw(
          "flex-row items-center justify-between px-5 top-9 mb-5"
        )}
      >
        <TouchableOpacity onPress={logOut}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={tw("h-14 w-14")}
            source={require("../assets/tinder.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Chat")
          }
        >
          <Ionicons
            name="chatbubbles-sharp"
            size={32}
            color="#FF5864"
          />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={tw('flex-1 -mt-6')}>
        <Swiper 
          containerStyle={{ backgroundColor: 'transparent' }} 
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          cards={DUMMY_DATA} renderCard={card => (
            <View key={card.id} style={tw('bg-white h-3/4 rounded-xl relative')}>
              <Image 
                style={tw('absolute h-full w-full rounded-xl top-0')} 
                source={{ uri: card.photoURL }} 
              />

              <View style={[tw('absolute bottom-0 bg-white w-full h-20 flex-row justify-between items-between px-6 py-2 rounded-b-xl'), styles.cardShadow]}> 
                <View>
                  <Text style={tw('text-xl font-bold')}>{card.firstName} {card.lastName}</Text>
                  <Text>{card.occupation}</Text>
                </View>
                  <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
              </View>
            </View>
        )} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  }
});
