import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import { router } from 'expo-router';

export default function SignUpScreen() {
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
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Sign up" onPress={handleSignIn} />
      <Button title="Sign in HERE" onPress={() => router.replace("../sign-in")} />
    </View>
  );
}


