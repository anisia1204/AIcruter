import { View, StyleSheet, SafeAreaView } from 'react-native'; 
import { router } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/providers/AuthContext';
import { apiPost } from '@/lib/api';
import { ThemedText } from '@/components/ThemedText';
import MainView from '@/components/templates/MainView';
import FormField from '@/components/atoms/FormField';
import { StyledButton } from '@/components/atoms/StyledButton';

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
      <SafeAreaView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            AiCruter
          </ThemedText>

          <FormField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          <FormField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <StyledButton label="Sign In" onPress={handleSignIn} />
            <StyledButton
              label="Sign Up Here"
              variant="outline"
              onPress={() => router.replace('../sign-up')}
            />
          </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
});

export default SignInScreen;
