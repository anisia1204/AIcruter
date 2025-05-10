import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, clearToken } from '@/lib/authToken';

interface AuthContextType {
    isAuthenticated: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const signIn = async(token: string) => {
        await saveToken(token);
        setIsAuthenticated(true);
    };

    const signOut = async() => {
        await clearToken();
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            setIsAuthenticated(!!token);
            setLoading(false);
        };
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};