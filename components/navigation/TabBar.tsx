import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { House, Dog, MessageCircle, User, type LucideIcon } from 'lucide-react-native';
import { elevation, spacing, useTheme } from '@/theme';
import { Text } from '@/components/ui';

const ICONS: Record<string, LucideIcon> = {
  index: House,
  breeds: Dog,
  assistant: MessageCircle,
  profile: User,
};

/** Eigene Tab-Bar. Nur Routen aus ICONS werden gezeigt — der Rest ist ausgeblendet. */
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
        const Icon = ICONS[route.name];
        if (!Icon) return null;

        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;

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
