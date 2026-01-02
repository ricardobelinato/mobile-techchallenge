import CustomDrawer from '@/components/CustomDrawer';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, Pressable, TouchableOpacity } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}

function LayoutContent() {
  const { auth, loading } = useAuth();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isLogged = !!auth;
    const isLoginRoute = pathname === '/' || pathname === '/index';

    if (!isLogged && !isLoginRoute) {
      router.replace('/');
    }

    // if (isLogged && isLoginRoute) {
    //   router.replace('/home');
    // }
  }, [auth, loading, pathname]);

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Stack
        screenOptions={{
          title: 'SchoolOn',
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E5',
          },
          headerTitle: () => (
            <Pressable onPress={() => router.push('/home')}>
              <Image
                source={require('../assets/images/icon-school.png')}
                style={{ width: 140, height: 40, resizeMode: 'contain' }}
              />
            </Pressable>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ marginLeft: 12 }}>
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="post/create" options={{ title: 'Criar Post' }} />
        <Stack.Screen name="post/update" options={{ title: 'Editar Post' }} />
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
