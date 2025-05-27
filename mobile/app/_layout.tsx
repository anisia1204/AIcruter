import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/providers/AuthContext';
import RootNavigation from './RootNavigation';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/atoms/ToastConfig';
import useAuthTokenGuard from '@/lib/useAuthTokenGuard';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  const AuthGuard = () => {
    useAuthTokenGuard();
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard />
        <RootNavigation />
        <Toast config={toastConfig} />
      </AuthProvider>
    </ThemeProvider>
  );
}
