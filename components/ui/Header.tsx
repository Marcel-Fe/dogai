import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { layout, spacing, useTheme } from '@/theme';
import { Text } from './Text';

type Props = {
  title?: string;
  right?: React.ReactNode;
};

/** Schlanke Kopfzeile mit Zurück-Button für Detail-Screens. */
export function Header({ title, right }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.sm,
        minHeight: layout.minTouch,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityLabel="Zurück"
        style={({ pressed }) => ({
          width: layout.minTouch,
          height: layout.minTouch,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <ChevronLeft size={26} color={colors.text} />
      </Pressable>
      <Text variant="heading" style={{ flex: 1 }} numberOfLines={1}>
        {title ?? ''}
      </Text>
      {right ? <View>{right}</View> : null}
    </View>
  );
}
