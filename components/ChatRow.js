import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from "tailwind-rn";
import { collection, serverTimestamp, onSnapshot, query, orderBy, limit } from '@firebase/firestore';
import { db } from '../fireebase';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user]);

    useEffect(() => 
      onSnapshot(query(collection(db, 'madeMatches', matchDetails.id, 'messages'), 
      orderBy('timestamp', 'desc'), limit(1)),
      snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
      ), [db, matchDetails]);

    return (
        <TouchableOpacity 
          style={[tw('flex-row items-center py-3 px-5 bg-blue-300 mx-3 my-1 rounded-2xl'), 
          styles.cardShadow]}
          onPress={() => navigation.navigate('Message', {
            matchDetails
          })}
        >
            <Image 
              style={tw('rounded-full h-16 w-16 mr-4')} 
              source={ { uri: matchedUserInfo?.photoURL } } 
            />

            <View>
              <Text style={tw('text-base font-semibold -top-2 text-white')}>
                {matchedUserInfo?.displayName}
              </Text>
              <Text style={tw('text-lg')}>
                {lastMessage || 'Say Hi!'}
              </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});