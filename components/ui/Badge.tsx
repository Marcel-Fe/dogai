import { View } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from './Text';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';

type Props = {
  label: string;
  tone?: BadgeTone;
};

/** Kompaktes Status-Label, z. B. für Severity oder Kategorien. */
export function Badge({ label, tone = 'neutral' }: Props) {
  const { colors } = useTheme();

  const palette: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    accent: { bg: colors.accentSoft, fg: colors.accent },
    success: { bg: colors.successSoft, fg: colors.success },
    warn: { bg: colors.warnSoft, fg: colors.warn },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  };
  const p = palette[tone];

  return (
    <View
      style={{
        backgroundColor: p.bg,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="label" style={{ color: p.fg }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
