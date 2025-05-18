import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '@/providers/AuthContext'; 
import { router } from 'expo-router';

const ProfileScreen = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => {
        signOut()
    router.replace("../sign-in"); 
       } },
    ]);
  };

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
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

export default ProfileScreen;