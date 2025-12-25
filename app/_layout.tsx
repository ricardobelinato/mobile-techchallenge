// // app/_layout.tsx
// import CustomDrawer from '@/components/CustomDrawer';
// import { useColorScheme } from '@/hooks/use-color-scheme';
// import { Ionicons } from '@expo/vector-icons';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Image, TouchableOpacity } from 'react-native';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
//       <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#FFFFFF',
//             borderBottomWidth: 1,
//             borderBottomColor: '#E5E5E5',
//           },
//           headerTitle: () => (
//             <Image
//               source={require('../assets/images/icon-school.png')}
//               style={{ width: 140, height: 40, resizeMode: 'contain' }}
//             />
//           ),
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ marginLeft: 12 }}>
//               <Ionicons name="menu" size={28} color="#000" />
//             </TouchableOpacity>
//           ),
//           headerRight: () => (
//             <TouchableOpacity onPress={() => console.log("Abrir perfil")} style={{ marginRight: 12 }}>
//               <Ionicons name="person-circle-outline" size={32} color="#000" />
//             </TouchableOpacity>
//           ),
//           headerTitleAlign: 'center',
//         }}
//       >

//         {/* Login */}
//         <Stack.Screen name="index" options={{ headerShown: false }} />

//         {/* Tabs */}
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

//         {/* Telas de Post */}
//         <Stack.Screen name="posts/create" options={{ title: "Criar Post" }} />
//         <Stack.Screen name="posts/update" options={{ title: "Editar Post" }} />

//       </Stack>

//       <StatusBar style="dark" />
//     </ThemeProvider>
//   );
// }

// app/_layout.tsx


import CustomDrawer from '@/components/CustomDrawer';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native'; // Importado Alert

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const segments = useSegments();
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulação: aqui você verificaria se existe um token salvo
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'posts';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/'); 
    } else if (isAuthenticated && (segments[0] === undefined || segments[0] === 'index')) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) return null; 

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
        {/* Passamos o estado de autenticação para as telas se necessário via Context ou Params */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts/create" options={{ title: "Criar Post" }} />
        <Stack.Screen name="posts/update" options={{ title: "Editar Post" }} />
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}