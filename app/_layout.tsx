// app/_layout.tsx
import CustomDrawer from '@/components/CustomDrawer';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E5',
          },
          headerTitle: () => (
            <Image
              source={require('../assets/images/icon-school.png')}
              style={{ width: 140, height: 40, resizeMode: 'contain' }}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ marginLeft: 12 }}>
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log("Abrir perfil")} style={{ marginRight: 12 }}>
              <Ionicons name="person-circle-outline" size={32} color="#000" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      >

        {/* Login */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Telas de Post */}
        <Stack.Screen name="posts/create" options={{ title: "Criar Post" }} />
        <Stack.Screen name="posts/update" options={{ title: "Editar Post" }} />

      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
