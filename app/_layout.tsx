// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Esta é a sua tela de Login (app/index.tsx) */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="home" options={{ headerShown: false }} />
        
        {/* Este é o seu grupo de abas (app/(tabs)/...) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Sua tela modal (app/modal.tsx) */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}