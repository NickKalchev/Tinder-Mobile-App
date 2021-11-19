import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut
} from '@firebase/auth';
import { auth } from '../fireebase';

const AuthContext = createContext({});

const config = {
    androidClientId: '398862951178-7k627kdhs4e76ig2a2t8lb2ai16o5524.apps.googleusercontent.com',
    iosClientId: '398862951178-mq0cqvoi6staa9ghum4ernlb12ukhcd5.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"]
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => onAuthStateChanged(auth, (user) => {
          if(user) {
             setUser(user);
          } else {
              setUser(null);
          };

          setInitialLoading(false);
      }), []);

    const signInWithGoogle = async () => {
        setLoading(true);

        await Google.logInAsync(config).then(async (loginResult) => {
            if(loginResult.type === 'success'){
                const { idToken, accessToken } = loginResult;
                const credentials = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credentials);
            }

            return Promise.reject();
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    };

    const logOut = () => {
        setLoading(true);
        signOut(auth).catch(error => setError(error)).finally(() => setLoading(false));
    };

    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logOut
    }), [user, error, loading]);


    return (
        <AuthContext.Provider value={memoedValue}>
           {!initialLoading && children}
        </AuthContext.Provider>
    )
};

export default function useAuth() {
    return useContext(AuthContext);
}

