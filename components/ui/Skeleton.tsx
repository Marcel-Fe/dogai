import { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { radius as radiusTokens, useTheme } from '@/theme';

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

/** Platzhalter-Block mit Puls-Animation für Ladezustände. */
export function Skeleton({ width = '100%', height = 16, radius }: Props) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? radiusTokens.sm,
          backgroundColor: colors.surfaceAlt,
        },
        animStyle,
      ]}
    />
  );
}
