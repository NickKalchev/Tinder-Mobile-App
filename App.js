import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); // Ignore log notifications for now
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>      
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
