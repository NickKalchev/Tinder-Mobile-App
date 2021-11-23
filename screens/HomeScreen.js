import { useNavigation } from "@react-navigation/core";
import React, {
  useLayoutEffect,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import {
  AntDesign,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import emoji from '../assets/emoji.png'
import { onSnapshot, doc, collection, getDocs, getDoc, setDoc, query, where, serverTimestamp } from '@firebase/firestore';
import { db } from "../fireebase";
import generateID from '../lib/generateID';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logOut, user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => 
    onSnapshot(doc(db, 'users', user.uid), snapshot => {
    if(!snapshot.exists()){
      navigation.navigate('Modal');
    }
  }), [])

  useEffect(() => {
    let unsubcribe;
    
    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then((snapshot) => (
        snapshot.docs.map(doc => doc.id)
      )).catch((err) => {
        alert(err.message)
      });

        const matches = await getDocs(collection(db, 'users', user.uid, 'matches')).then((snapshot) => (
        snapshot.docs.map(doc => doc.id)
      )).catch((err) => {
        alert(err.message)
      });

      const passedUsers = passes.length > 0 ? passes : ['testing query'];
      const matchedUsers = matches.length > 0 ? matches : ['testing query'];

      unsubcribe = onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passedUsers, ...matchedUsers])), snapshot => {
        setProfiles(snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      });
    };

    fetchCards();
    return unsubcribe;
  }, [db])

  const swipeLeft = (cardIndex) => {
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped pass on ${userSwiped.displayName}`);

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async(cardIndex) => {
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user.uid))
    ).data();

    getDoc(doc(db, 'users', userSwiped.id, 'matches', user.uid)).then((documentSnapshot) => {
      if(documentSnapshot.exists()) {
        console.log(`Hooray, you MATCHED with ${userSwiped.displayName}`);
        setDoc(doc(db, 'users', user.uid, 'matches', userSwiped.id), userSwiped)

        // Create a match
        setDoc(doc(db, 'madeMatches', generateID(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp()
        });

        navigation.navigate('Match', {
          loggedInProfile,
          userSwiped
        });

      } else {
        console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`);
      }
    }).catch((err) => {
      alert(err.message)
    });

    setDoc(doc(db, 'users', user.uid, 'matches', userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View
        style={tw("relative top-8 items-center")}
      >
        <TouchableOpacity
          style={tw("absolute left-2 top-2")}
          onPress={logOut}
        >
          <Image
            style={tw(
              "h-10 w-10 rounded-full ml-3"
            )}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw("items-center")}
          onPress={() =>
            navigation.navigate("Modal")
          }
        >
          <Image
            style={tw("h-16 w-16")}
            source={require("../assets/tinder.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw("absolute right-5 top-3")}
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
      <View style={tw("flex-1")}>
        <Swiper
          containerStyle={{
            backgroundColor: "transparent",
          }}
          ref={swipeRef}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex)
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex)
          }}
          verticalSwipe={false}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#44f425",
                },
              },
            },
          }}
          cards={profiles}
          renderCard={(card) => card ? (
            <View
              key={card.id}
              style={tw(
                "bg-white h-3/4 rounded-xl relative"
              )}
            >
              <Image
                style={tw(
                  "absolute h-full w-full rounded-xl top-0"
                )}
                source={{ uri: card.photoURL }}
              />
              <View
                style={[
                  tw(
                    "absolute bottom-0 bg-white w-full h-20 flex-row justify-between items-between px-6 py-2 rounded-b-xl"
                  ),
                  styles.cardShadow,
                ]}
              >
                <View>
                  <Text
                    style={tw(
                      "text-xl font-bold"
                    )}
                  >
                    {card.displayName}
                  </Text>
                  <Text>{card.job}</Text>
                </View>
                <Text
                  style={tw("text-2xl font-bold")}
                >
                  {card.age}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[tw('relative bg-gray-50 h-3/4 rounded-xl justify-center items-center'), styles.cardShadow]}>
              <Text style={tw('font-bold text-xl pb-5')}>No more profiles❗️</Text>
              <Image
              style={tw('h-72 w-full')}
              height={100}
              width={100}
              source={emoji}
              />
            </View>
          )}
        />
      </View>
      <View
        style={tw(
          "flex-row flex justify-evenly mb-8"
        )}
      >
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-20 h-20 bg-red-200"
          )}
          onPress={() =>
            swipeRef.current.swipeLeft()
          }
        >
          <Entypo
            name="cross"
            size={38}
            color="red"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-20 h-20 bg-green-200"
          )}
          onPress={() =>
            swipeRef.current.swipeRight()
          }
        >
          <AntDesign
            name="heart"
            size={32}
            color="green"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
