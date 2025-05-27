import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getToken, clearToken } from '../lib/authToken';
import { isTokenExpired } from '../lib/checkToken';
import { useAuth } from '@/providers/AuthContext';

const useAuthTokenGuard = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (!token || isTokenExpired(token)) {
        await clearToken();
        signOut();
        router.replace('/sign-in');
      }
    };
    checkToken();
  }, [router, signOut]);
};

export default useAuthTokenGuard;