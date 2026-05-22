import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { elevation, radius, spacing, useTheme } from '@/theme';
import { Text } from './Text';

type ToastTone = 'info' | 'success' | 'error';
type ToastState = { message: string; tone: ToastTone } | null;

type ToastApi = {
  show: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/** Stellt App-weit `useToast()` bereit. Muss nahe der Root liegen. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: ToastTone = 'info') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const api = useMemo<ToastApi>(() => ({ show }), [show]);

  const toneColor: Record<ToastTone, string> = {
    info: colors.text,
    success: colors.success,
    error: colors.danger,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <Animated.View
          entering={SlideInUp.springify().damping(18)}
          exiting={SlideOutUp}
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: insets.top + spacing.sm,
            left: spacing.lg,
            right: spacing.lg,
          }}
        >
          <View
            style={[
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                borderLeftWidth: 4,
                borderLeftColor: toneColor[toast.tone],
                borderWidth: 1,
                borderColor: colors.border,
                padding: spacing.md,
              },
              elevation.medium as object,
            ]}
          >
            <Text variant="body">{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
