import * as SecureStore from 'expo-secure-store';

export const saveToken = (token: string) => SecureStore.setItemAsync('authToken', token);
export const getToken = () => SecureStore.getItemAsync('authToken');
export const clearToken = () => SecureStore.deleteItemAsync('authToken');


