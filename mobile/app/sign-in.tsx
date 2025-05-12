import { View, StyleSheet, Text } from 'react-native'; 
import { router } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/providers/AuthContext';
import { apiPost } from '@/lib/api';
import FormField from '@/components/atoms/InputFormField';
import { StyledButton } from '@/components/atoms/StyledButton';
import { useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import AuthView from '@/components/templates/AuthView';

const SignInScreen = () => {
  const { colors } = useTheme();
  
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setEmailError(null);
    setPasswordError(null);
    let hasError = false;

    if (!email) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) return;
    try {
      if (!email || !password) return;
      console.log("email", email);
      console.log("password", password);
      // const response = await apiPost('/auth/login', { email, password });
      // signIn(response.token);
      // router.replace('../')
    } catch (err) {
      console.warn('Login failed', err);
    }
  };

  return (
    <AuthView>
      <ThemedText type="title" style={styles.title}>AiCruter</ThemedText>

      <FormField
        label="Email"
        placeholder="Email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
      />

      <FormField
        label="Password"
        placeholder="Password..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        error={passwordError}
      />

      <View style={styles.buttonContainer}>
        <StyledButton label="Sign In" onPress={handleSignIn} />
        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <Text
              style={[styles.signUpLink, { color: colors.primary }]}
              onPress={() => router.replace('../sign-up')}
            >
              Sign up here.
            </Text>
          </Text>
        </View>
      </View>
    </AuthView>
  );
};

const styles = StyleSheet.create({
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
  signUpTextContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#333',
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
