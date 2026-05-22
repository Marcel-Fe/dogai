import { View } from 'react-native';
import { CloudOff } from 'lucide-react-native';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from '@/components/ui';

type Props = {
  /** Kurzbeschreibung, welche Funktion ein Backend braucht. */
  feature?: string;
};

/**
 * Hinweis im Demo-Modus: Diese Funktion benötigt ein verbundenes Backend
 * (Supabase + KI). Wird statt eines Absturzes angezeigt.
 */
export function DemoNotice({ feature }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.md,
        backgroundColor: colors.accentSoft,
        borderRadius: radius.md,
        padding: spacing.lg,
      }}
    >
      <CloudOff size={22} color={colors.accent} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong">Demo-Modus</Text>
        <Text variant="caption" tone="muted">
          {feature ?? 'Diese Funktion'} braucht ein verbundenes Backend (Supabase + KI).
          Sobald DogAI mit einem Backend verbunden ist, ist sie sofort nutzbar.
        </Text>
      </View>
    </View>
  );
}
