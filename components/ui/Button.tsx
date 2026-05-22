import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

const heights: Record<Size, number> = { sm: 38, md: 48, lg: 56 };

/** Primäre Aktions-Komponente mit Press-Animation und Haptik. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  icon,
  style,
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const bg: Record<Variant, string> = {
    primary: colors.accent,
    secondary: colors.surfaceAlt,
    ghost: 'transparent',
    danger: colors.danger,
  };
  const fg: Record<Variant, 'inverse' | 'default' | 'accent'> = {
    primary: 'inverse',
    secondary: 'default',
    ghost: 'accent',
    danger: 'inverse',
  };

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[animStyle, fullWidth && { width: '100%' }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
        disabled={isDisabled}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress();
        }}
        style={[
          {
            height: heights[size],
            backgroundColor: bg[variant],
            borderRadius: radius.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            borderWidth: variant === 'ghost' ? 1 : 0,
            borderColor: colors.border,
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.text : colors.accentText} />
        ) : (
          <>
            {icon ? <View>{icon}</View> : null}
            <Text variant="bodyStrong" tone={fg[variant]}>
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
