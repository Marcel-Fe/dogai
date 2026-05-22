import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Header, Screen, Skeleton, Text } from '@/components/ui';
import { BreedImage } from '@/components/breed/BreedImage';
import { VetWarning } from '@/components/common/VetWarning';
import { DemoNotice } from '@/components/common/DemoNotice';
import { getBreed } from '@/data/breeds';
import { useBreedDetail } from '@/features/breeds/api';
import { isDemoMode } from '@/lib/env';
import { formatRange } from '@/utils/format';
import { breedTips } from '@/utils/breedTips';
import { breedRatings } from '@/utils/breedProfile';
import { radius, spacing, useTheme } from '@/theme';

export default function BreedDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const breed = getBreed(id);

  if (!breed) {
    return (
      <Screen>
        <Header />
        <Text variant="body" tone="muted">{t('common.error')}</Text>
      </Screen>
    );
  }

  const name = i18n.language === 'en' ? breed.nameEn : breed.nameDe;
  const short = i18n.language === 'en' ? breed.shortEn : breed.shortDe;

  return (
    <Screen scroll padded={false}>
      <Header title={name} />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <BreedImage breedId={breed.id} height={240} />

        <View style={{ gap: spacing.sm }}>
          <Badge label={`FCI ${breed.fciGroup}`} tone="accent" />
          <Text variant="title">{name}</Text>
          <Text variant="body" tone="muted">{short}</Text>
        </View>

        {/* Steckbrief — berechnete Bewertungen */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.atAGlance')}</Text>
          <Card>
            {breedRatings(breed, i18n.language).map((r, i, arr) => (
              <RatingRow
                key={r.key}
                label={r.label}
                value={r.value}
                last={i === arr.length - 1}
              />
            ))}
          </Card>
        </View>

        {/* Kernfakten */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.size')} & {t('breeds.origin')}</Text>
          <Card>
            <FactRow label={t('breeds.origin')} value={breed.origin} />
            <FactRow label={t('breeds.size')} value={t(`breeds.size_${breed.sizeClass}`)} />
            <FactRow label={t('breeds.weight')} value={formatRange(breed.weightKg, 'kg')} />
            <FactRow label={t('breeds.height')} value={formatRange(breed.heightCm, 'cm')} />
            <FactRow
              label={t('breeds.lifespan')}
              value={formatRange(breed.lifespanYears, t('breeds.years'))}
            />
            <FactRow label="Fell / Coat" value={breed.coat} last />
          </Card>
        </View>

        {/* Wesen */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.temperament')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {breed.temperament.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </View>
        </View>

        {/* Bekannte Veranlagungen */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.predispositions')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {breed.predispositions.map((p) => (
              <Badge key={p} label={p} tone="warn" />
            ))}
          </View>
          <VetWarning />
        </View>

        {/* Alltagstipps — aus den Rassendaten abgeleitet, offline verfügbar */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.everydayTips')}</Text>
          <Card>
            {breedTips(breed, i18n.language).map((tip, i, arr) => (
              <View
                key={tip.title}
                style={{
                  paddingVertical: spacing.md,
                  borderBottomWidth: i === arr.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                  gap: spacing.xs,
                }}
              >
                <Text variant="bodyStrong">{tip.title}</Text>
                <Text variant="body" tone="muted">{tip.text}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* KI-Detailtexte */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.aiDetails')}</Text>
          <BreedDeepContent breedId={breed.id} />
        </View>
      </View>
    </Screen>
  );
}

function RatingRow({
  label,
  value,
  last,
}: {
  label: string;
  value: number;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text variant="caption" tone="muted">{label}</Text>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <View
            key={n}
            style={{
              width: 10,
              height: 10,
              borderRadius: radius.pill,
              backgroundColor: n <= value ? colors.accent : colors.surfaceAlt,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function FactRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text variant="caption" tone="muted">{label}</Text>
      <Text variant="caption" style={{ flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

function BreedDeepContent({ breedId }: { breedId: string }) {
  // Im Demo-Modus kein KI-Aufruf — Hinweis statt Detailtexten.
  if (isDemoMode) {
    return <DemoNotice feature="Ausführliche KI-Rasseninfos" />;
  }
  return <BreedDeepContentLive breedId={breedId} />;
}

function BreedDeepContentLive({ breedId }: { breedId: string }) {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useBreedDetail(breedId, i18n.language);

  if (isLoading) {
    return (
      <View style={{ gap: spacing.sm }}>
        <Text variant="caption" tone="muted">{t('breeds.generating')}</Text>
        <Skeleton height={80} radius={12} />
        <Skeleton height={80} radius={12} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <Text variant="caption" tone="muted">{t('common.error')}</Text>
    );
  }

  const sections: { key: string; label: string }[] = [
    { key: 'care', label: t('breeds.care') },
    { key: 'training', label: t('breeds.training') },
    { key: 'nutrition', label: t('breeds.nutrition') },
    { key: 'health', label: t('breeds.health') },
    { key: 'behavior', label: t('breeds.behavior') },
  ];

  return (
    <View style={{ gap: spacing.lg }}>
      {sections.map((s) => (
        <View key={s.key} style={{ gap: spacing.xs }}>
          <Text variant="heading">{s.label}</Text>
          <Text variant="body" tone="muted">{(data as Record<string, string>)[s.key]}</Text>
        </View>
      ))}
    </View>
  );
}
