import { useEffect } from 'react';
import { View } from 'react-native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
import '@/lib/i18n';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { ToastProvider } from '@/components/ui';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Leitet je nach Auth-Status in den (auth)- oder (tabs)-Bereich. */
function AuthGate() {
  const { session, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (initializing) return;
    SplashScreen.hideAsync().catch(() => {});
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, initializing, segments, router]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="dog/[id]" />
      <Stack.Screen name="dog/form" />
      <Stack.Screen name="breed/[id]" />
      <Stack.Screen name="scan/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const { isDark } = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <AuthGate />
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
