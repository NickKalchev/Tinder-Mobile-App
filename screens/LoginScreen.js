import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn';

const LoginScreen = () => {

    const { signInWithGoogle, loading } = useAuth();
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
       navigation.setOptions({
           headerShown: false
       });
    }, [])


    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
             resizeMode='cover'
             style={tw("flex-1")}
             source={{ uri: "https://tinder.com/static/tinder.png" }}
            >
            <TouchableOpacity 
              style={[tw("absolute bottom-40 w-60 bg-white p-4 px-6 rounded-3xl"), 
                { marginHorizontal: '25%'}]}
              onPress={signInWithGoogle}
            > 
              <Text 
                style={tw("text-center font-semibold text-lg text-red-600")}
              >
                Sign in & get swiping
              </Text>
            </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen
