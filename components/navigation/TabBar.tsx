import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { House, Dog, Sparkles, ScanLine, User, type LucideIcon } from 'lucide-react-native';
import { elevation, radius, spacing, useTheme } from '@/theme';
import { Text } from '@/components/ui';

const ICONS: Record<string, LucideIcon> = {
  index: House,
  breeds: Dog,
  assistant: Sparkles,
  scan: ScanLine,
  profile: User,
};

/** Eigene Tab-Bar — Scan-Tab in der Mitte als hervorgehobener Action-Button. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom || spacing.sm,
          paddingTop: spacing.sm,
          paddingHorizontal: spacing.sm,
        },
        elevation.medium as object,
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;
        const Icon = ICONS[route.name] ?? House;
        const isCenter = route.name === 'scan';

        const onPress = () => {
          Haptics.selectionAsync().catch(() => {});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                onPress={onPress}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.lg,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -18,
                  ...(elevation.low as object),
                }}
              >
                <Icon size={26} color={colors.accentText} />
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.xs }}
          >
            <Icon
              size={22}
              color={focused ? colors.accent : colors.textMuted}
              strokeWidth={focused ? 2.4 : 2}
            />
            <Text variant="label" style={{ color: focused ? colors.accent : colors.textMuted }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
