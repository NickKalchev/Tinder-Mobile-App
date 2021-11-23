import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-rn";
import { useNavigation, useRoute } from '@react-navigation/core';
import match from '../assets/match.png';

const MatchScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { loggedInProfile, userSwiped } = params;

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

    return (
        <View style={[tw('h-full bg-red-500 pt-16'), { opacity: 0.89 }]}>
            <View style={tw('justify-center px-10 pt-20')}>
              <Image style={tw("h-20 w-full")} source={match} />
            </View>

            <Text style={tw('text-white text-center mt-5 text-base')}>
              You and {userSwiped.displayName} have liked each other!
            </Text>

            <View style={tw('flex-row justify-evenly mt-14')}>
              <Image 
                source={{ uri: loggedInProfile.photoURL }} 
                style={tw('h-36 w-36 rounded-full')}
              />
              <Image 
                source={{ uri: userSwiped.photoURL }} 
                style={tw('h-36 w-36 rounded-full')}
              />
            </View>

            <TouchableOpacity
              style={tw('bg-white m-5 mx-10 px-6 py-6 rounded-full mt-28')}
              onPress={() => {
                  navigation.goBack();
                  navigation.navigate('Chat');
              }}
            >
              <Text style={tw('text-center text-base font-semibold')}>Send a Message</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MatchScreen
