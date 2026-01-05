import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export async function saveAuth(data) {
  const token = data.token;
  const user = {
    id: data.id,
    nome: data.nome,
    email: data.email,
    admin: data.admin
  };

  if (Platform.OS === 'web' && isBrowser()) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export async function getAuth() {
  if (Platform.OS === 'web' && isBrowser()) {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const user = sessionStorage.getItem(USER_KEY);
    return token ? { token, user: JSON.parse(user) } : null;
  }

  if (Platform.OS !== 'web') {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const user = await AsyncStorage.getItem(USER_KEY);
    return token ? { token, user: JSON.parse(user) } : null;
  }

  return null;
}

export async function clearAuth() {
  if (Platform.OS === 'web' && isBrowser()) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } else {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }
}
