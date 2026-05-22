import { Linking, Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Heart } from 'lucide-react-native';
import { Badge, Card, Header, Screen, Text } from '@/components/ui';
import { BreedImage } from '@/components/breed/BreedImage';
import { VetWarning } from '@/components/common/VetWarning';
import { useProfile } from '@/features/profile/store';
import { getBreed } from '@/data/breeds';
import { formatRange } from '@/utils/format';
import { breedTips } from '@/utils/breedTips';
import { breedRatings } from '@/utils/breedProfile';
import { radius, spacing, useTheme } from '@/theme';

export default function BreedDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const favorites = useProfile((s) => s.favorites);
  const toggleFavorite = useProfile((s) => s.toggleFavorite);
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
  const isFav = favorites.includes(breed.id);

  return (
    <Screen scroll padded={false}>
      <Header title={name} />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <BreedImage breedId={breed.id} height={240} />

        <View style={{ gap: spacing.sm }}>
          <Badge label={`FCI ${breed.fciGroup}`} tone="accent" />
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
            <Text variant="title" style={{ flex: 1 }}>{name}</Text>
            <Pressable
              onPress={() => toggleFavorite(breed.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('breeds.favorite')}
            >
              <Heart
                size={26}
                color={isFav ? colors.accent : colors.textMuted}
                fill={isFav ? colors.accent : 'transparent'}
              />
            </Pressable>
          </View>
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

        {/* Welpen & Züchter */}
        <View style={{ gap: spacing.sm }}>
          <Text variant="heading">{t('breeds.breeders')}</Text>
          <Card>
            <Text variant="body" tone="muted">{t('breeds.breedersIntro')}</Text>
            <View style={{ marginTop: spacing.sm }}>
              <BreederLink label={t('breeds.breedersVdh')} url="https://www.vdh.de/welpen/" />
              <BreederLink
                label={t('breeds.breedersSearch')}
                url={`https://www.google.com/search?q=${encodeURIComponent(`${name} Welpen Züchter`)}`}
              />
            </View>
            <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
              {t('breeds.breedersNote')}
            </Text>
          </Card>
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

function BreederLink({ label, url }: { label: string; url: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => Linking.openURL(url).catch(() => {})}
      accessibilityRole="link"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <ExternalLink size={18} color={colors.accent} />
      <Text variant="bodyStrong" tone="accent" style={{ flex: 1 }}>{label}</Text>
    </Pressable>
  );
}
