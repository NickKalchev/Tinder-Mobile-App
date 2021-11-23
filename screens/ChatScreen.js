import React, { useLayoutEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import { useNavigation } from "@react-navigation/core";

const ChatScreen = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

    return (
        <SafeAreaView>
            <Header title='Chat' />
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen
