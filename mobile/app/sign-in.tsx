import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/providers/AuthContext';
import { apiPost, BASE_URL } from '@/lib/api';
import FormField from '@/components/atoms/InputFormField';
import { StyledButton } from '@/components/atoms/StyledButton';
import { useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import AuthView from '@/components/templates/AuthView';
import Toast from 'react-native-toast-message';

type FormData = {
  email: string;
  password: string;
};

const SignInScreen = () => {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await apiPost('/api/user-account/login', data);
      console.log("response", response)
      signIn(response.token);
      await AsyncStorage.setItem('userId', String(response.id));
      
      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        visibilityTime: 5000,
      });

      router.replace("./(tabs)")
    } catch (err) {
      console.warn('Login failed', err);
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Invalid credentials or server error',
      });
    }
  };

  return (
    <AuthView>
      <ThemedText type="title" style={styles.title}>AiCruter</ThemedText>

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Email"
            placeholder="Email..."
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required.',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            label="Password"
            placeholder="Password..."
            value={value}
            onChangeText={onChange}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password?.message}
          />
        )}
      />

      <View style={styles.buttonContainer}>
        <StyledButton label="Sign In" onPress={handleSubmit(onSubmit)} />
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
