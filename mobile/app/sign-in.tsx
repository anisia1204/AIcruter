import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import { router } from 'expo-router';

const SignInScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await apiPost('/auth/login', { email, password });
      signIn(response.token);
    } catch (err) {
      console.warn('Login failed', err);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Text</Text>
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign UP HERE" onPress={() => router.replace("../sign-up")} />
    </View>
  );
};

export default SignInScreen;


