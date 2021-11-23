import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute } from "@react-navigation/core";
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import tw from "tailwind-rn";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from '@firebase/firestore';
import { db } from '../fireebase';

const MessageScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { params } = useRoute();
    const { matchDetails } = params;  
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      onSnapshot(query(collection(db, 'madeMatches', matchDetails.id, 'messages'), 
      orderBy('timestamp', 'desc')),
      snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
      );
    }, [matchDetails, db])


    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

    const sendMessage = async () => {
     await addDoc(collection(db, 'madeMatches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userID: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input
      }).then(() => {
        setInput('')
      }).catch((err) => {
        alert(err)
      });
    };

    return (
        <SafeAreaView style={tw('flex-1 bg-white')}>
            <Header 
              title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} 
              call 
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? "padding" : "height"}
              style={tw('flex-1')}
              keyboardVerticalOffset={10}
            >

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <FlatList
                data={messages}
                inverted={-1}
                style={tw('pl-4')}
                keyExtractor={item => item.id}
                renderItem={({ item: message }) => 
                  message.userID === user.uid ? (
                    <SenderMessage key={message.id} message={message} />
                  ) : (
                    <ReceiverMessage key={message.id} message={message} />
                  )
                }
              />
              </TouchableWithoutFeedback>


              <View
                style={tw('flex-row h-20 bg-gray-50 justify-between items-center border-t border-gray-200 px-5 py-2 mt-4')}
              >
                <TextInput 
                  style={tw('flex-1 h-10 text-lg')}
                  placeholder='Send Message...'
                  onChangeText={setInput}
                  onSubmitEditing={sendMessage}
                  value={input}
                />
                <Button onPress={sendMessage} title='Send' color='#FF5864' />
              </View> 
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessageScreen;
