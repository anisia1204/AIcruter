import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthContext';
import { useEffect } from 'react';

const RootNavigation = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/sign-in');
    //   router.replace('/(tabs)/explore');
    }
  }, [isAuthenticated, loading]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="sign-in" options={{ headerShown: false }}/>
      <Stack.Screen name="sign-up" options={{ headerShown: false }}/>
    </Stack>
  );
};

export default RootNavigation;
