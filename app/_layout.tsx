import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import '@/lib/i18n';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/features/auth/AuthContext';
import { ToastProvider } from '@/components/ui';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root-Navigator. Die Weiche Onboarding ↔ App trifft app/index.tsx über
 * eine <Redirect>-Komponente — kein imperatives Navigieren beim Mount.
 */
function RootNavigator() {
  const { colors } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="index" />
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
              <RootNavigator />
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
