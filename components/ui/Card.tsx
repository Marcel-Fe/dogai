import { Pressable, View, type ViewStyle } from 'react-native';
import { elevation, radius, spacing, useTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  raised?: boolean;
  style?: ViewStyle;
};

/** Container-Fläche für gruppierte Inhalte. Optional klickbar. */
export function Card({ children, onPress, padded = true, raised, style }: Props) {
  const { colors } = useTheme();
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: padded ? spacing.lg : 0,
    ...(raised ? (elevation.low as ViewStyle) : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
