import { View } from 'react-native';
import { Stethoscope } from 'lucide-react-native';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from '@/components/ui';

type Props = {
  /** 'soft' für Hinweise im Fluss, 'strong' bei Gesundheitsbefunden. */
  variant?: 'soft' | 'strong';
  message?: string;
};

const DEFAULT_MESSAGE =
  'DogAI stellt keine Diagnosen. Bei Auffälligkeiten oder Unsicherheit suche bitte immer einen Tierarzt auf.';

/**
 * Pflicht-Warnhinweis. Wird bei jedem KI-Gesundheitsbezug angezeigt.
 * Niemals entfernen — rechtliche und Sicherheits-Anforderung.
 */
export function VetWarning({ variant = 'soft', message }: Props) {
  const { colors } = useTheme();
  const strong = variant === 'strong';

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.sm,
        backgroundColor: strong ? colors.warnSoft : colors.surfaceAlt,
        borderRadius: radius.md,
        borderWidth: strong ? 1 : 0,
        borderColor: colors.warn,
        padding: spacing.md,
      }}
    >
      <Stethoscope size={18} color={strong ? colors.warn : colors.textMuted} />
      <Text variant="caption" tone={strong ? 'default' : 'muted'} style={{ flex: 1 }}>
        {message ?? DEFAULT_MESSAGE}
      </Text>
    </View>
  );
}
