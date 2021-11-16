import React, { createContext, useContext } from 'react';
import { View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut
} from '@firebase/auth';

const AuthContext = createContext({});

const config = {
    androidClientId: '398862951178-7k627kdhs4e76ig2a2t8lb2ai16o5524.apps.googleusercontent.com',
    iosClientId: '398862951178-mq0cqvoi6staa9ghum4ernlb12ukhcd5.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"]
}

export const AuthProvider = ({ children }) => {



    const signInWithGoogle = async () => {
        await Google.logInAsync(config).then(async (loginResult) => {
            if(loginResult.type === 'success'){
                const { idToken, accessToken } = loginResult;
                const credentials = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(credentials);
            }

            return Promise.reject();
        });
    };

    return (
        <AuthContext.Provider value={{
            user: null,
            signInWithGoogle
        }}>
           {children}
        </AuthContext.Provider>
    )
};

export default function useAuth() {
    return useContext(AuthContext);
}

