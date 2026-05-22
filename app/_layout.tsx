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
import { AuthProvider } from '@/features/auth/AuthContext';
import { useProfile } from '@/features/profile/store';
import { ToastProvider } from '@/components/ui';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Leitet je nach lokalem Profil in den Onboarding- oder (tabs)-Bereich. */
function AuthGate() {
  const hydrated = useProfile((s) => s.hydrated);
  const name = useProfile((s) => s.name);
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (!hydrated) return;
    SplashScreen.hideAsync().catch(() => {});
    const inAuthGroup = segments[0] === '(auth)';
    if (!name && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (name && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [hydrated, name, segments, router]);

  if (!hydrated) {
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
