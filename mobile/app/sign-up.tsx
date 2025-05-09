import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import { router } from 'expo-router';
import { UserAccount } from '@/domain/classTypes';
import { UserRole } from '@/domain/VOandEnums';
import { useTheme } from '@react-navigation/native';
import AuthView from '@/components/templates/AuthView';
import { ThemedText } from '@/components/ThemedText';
import FormField from '@/components/atoms/FormField';
import { StyledButton } from '@/components/atoms/StyledButton';

const SignUpScreen = () => {
  
  const { colors } = useTheme();
  const { signIn } = useAuth();

  const [userAccount, setUserAccount] = useState<UserAccount>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    picture: '',
    phoneNumber: '',
    userRole: UserRole.APPLICANT,
  });

  const [errors, setErrors] = useState<{ [K in keyof UserAccount]?: string }>({});

  const handleChange = (field: keyof UserAccount) => (value: string) => {
    setUserAccount((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = (): boolean => {
  const newErrors: typeof errors = {};

  if (!userAccount.firstName) newErrors.firstName = "First name is required.";
  if (!userAccount.lastName) newErrors.lastName = "Last name is required.";
  if (!userAccount.email) {
    newErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userAccount.email)) {
    newErrors.email = "Invalid email address.";
  }

  if (!userAccount.phoneNumber) {
    newErrors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{8,15}$/.test(userAccount.phoneNumber)) {
    newErrors.phoneNumber = "Invalid phone number.";
  }

  if (!userAccount.passwordHash) {
    newErrors.passwordHash = "Password is required.";
  } else if (userAccount.passwordHash.length < 6) {
    newErrors.passwordHash = "Password must be at least 6 characters.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      console.log('User:', userAccount);
      // await apiPost('/auth/register', userAccount);
      // router.replace('../');
    } catch (error) {
      console.warn('Registration failed:', error);
    }
  };

  return (
    <AuthView>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>

      <FormField
        label="First Name"
        placeholder="First name..."
        value={userAccount.firstName}
        onChangeText={handleChange('firstName')}
        error={errors.firstName}
      />

      <FormField
        label="Last Name"
        placeholder="Last name..."
        value={userAccount.lastName}
        onChangeText={handleChange('lastName')}
        error={errors.lastName}
      />

      <FormField
        label="Email"
        placeholder="Email..."
        value={userAccount.email}
        onChangeText={handleChange('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <FormField
        label="Phone"
        placeholder="Phone..."
        value={userAccount.phoneNumber}
        onChangeText={handleChange('phoneNumber')}
        keyboardType="phone-pad"
        error={errors.phoneNumber}
      />

      <FormField
        label="Password"
        placeholder="Password..."
        value={userAccount.passwordHash}
        onChangeText={handleChange('passwordHash')}
        secureTextEntry
        autoCapitalize="none"
        error={errors.passwordHash}
      />

      <View style={styles.buttonContainer}>
        <StyledButton label="Register" onPress={handleSignUp} />
        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>
            Already have an account?{' '}
            <Text
              style={[styles.signUpLink, { color: colors.primary }]}
              onPress={() => router.replace('../sign-in')}
            >
              Sign in here.
            </Text>
          </Text>
        </View>
      </View>
    </AuthView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
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


