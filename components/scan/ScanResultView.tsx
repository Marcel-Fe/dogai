import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react-native';
import { Badge, Card, Text, type BadgeTone } from '@/components/ui';
import { VetWarning } from '@/components/common/VetWarning';
import { spacing, useTheme } from '@/theme';
import type { ScanResult, ScanSeverity } from '@/types';

const severityTone: Record<ScanSeverity, BadgeTone> = {
  info: 'neutral',
  low: 'success',
  medium: 'warn',
  high: 'danger',
};

/** Stellt ein strukturiertes Vision-Ergebnis dar — inklusive Pflicht-Warnhinweis. */
export function ScanResultView({ result }: { result: ScanResult }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Severity */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Text variant="heading" style={{ flex: 1 }}>{t('scan.severity')}</Text>
        <Badge label={t(`scan.severity_${result.severity}`)} tone={severityTone[result.severity]} />
      </View>

      {/* Tierarzt erforderlich */}
      {result.vetRequired ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.dangerSoft,
            borderRadius: 12,
            padding: spacing.md,
          }}
        >
          <AlertTriangle size={20} color={colors.danger} />
          <Text variant="bodyStrong" tone="danger" style={{ flex: 1 }}>
            {t('scan.vetRequired')}
          </Text>
        </View>
      ) : null}

      {/* Beobachtungen */}
      {result.findings.length > 0 ? (
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('scan.findings')}</Text>
          {result.findings.map((f, i) => (
            <Card key={i}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text variant="bodyStrong" style={{ flex: 1 }}>{f.label}</Text>
                <Badge label={f.confidence} />
              </View>
              <Text variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
                {f.note}
              </Text>
            </Card>
          ))}
        </View>
      ) : null}

      {/* Empfehlung */}
      <View style={{ gap: spacing.xs }}>
        <Text variant="heading">{t('scan.recommendation')}</Text>
        <Text variant="body" tone="muted">{result.recommendation}</Text>
      </View>

      <VetWarning variant="strong" message={result.disclaimer} />
    </View>
  );
}
