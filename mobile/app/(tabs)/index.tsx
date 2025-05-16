import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '@/providers/AuthContext'; 
import { router } from 'expo-router';
import MainView from '@/components/templates/MainView';

export default function HomeScreen() {

  return (
    <MainView>
      
      <View>

      </View>

    </MainView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
