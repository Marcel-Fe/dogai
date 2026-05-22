import { useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Dog as DogIcon, Lightbulb, Plus, User } from 'lucide-react-native';
import { Card, Screen, Skeleton, Text } from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import { BreedImage } from '@/components/breed/BreedImage';
import { useAuth } from '@/features/auth/AuthContext';
import { useDogs } from '@/features/dogs/api';
import { breedCount, breeds, getBreed } from '@/data/breeds';
import breedImages from '@/data/breedImages.json';
import type { Breed } from '@/types';
import { dogAge } from '@/utils/format';
import { dailyTip } from '@/utils/dailyTip';
import { elevation, radius, spacing, useTheme } from '@/theme';

const images = breedImages as Record<string, string>;

/** Tag im Jahr — für täglich wechselnde Inhalte. */
function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export default function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: dogs, isLoading } = useDogs();

  const greetingName = user?.email?.split('@')[0] ?? '';
  const tip = dailyTip(i18n.language);

  // Täglich wechselnde Auswahl von 12 Rassen, gleichmäßig über den Katalog verteilt.
  const featured = useMemo<Breed[]>(() => {
    const day = dayOfYear();
    return Array.from({ length: 12 }, (_, i) => breeds[(day + i * 29) % breeds.length]);
  }, []);
  const heroUri = images[featured[0]?.id];

  return (
    <Screen scroll>
      {/* Hero mit Hundefoto */}
      <View
        style={{
          height: 168,
          borderRadius: radius.xl,
          overflow: 'hidden',
          marginBottom: spacing.xl,
          backgroundColor: colors.accent,
          justifyContent: 'flex-end',
        }}
      >
        {heroUri ? (
          <Image
            source={{ uri: heroUri }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
            cachePolicy="disk"
          />
        ) : null}
        <View
          style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.overlay }}
        />
        <View style={{ padding: spacing.xl }}>
          <Text variant="caption" style={{ color: '#FFFFFF', opacity: 0.85 }}>
            {t('home.greeting')}
          </Text>
          <Text variant="title" style={{ color: '#FFFFFF' }}>
            {greetingName} 👋
          </Text>
          <Text variant="body" style={{ color: '#FFFFFF', opacity: 0.9 }}>
            {t('home.subtitle')}
          </Text>
        </View>
      </View>

      {/* Meine Hunde */}
      <SectionHeader title={t('home.myDogs')} />
      {isLoading ? (
        <Skeleton height={84} radius={radius.lg} />
      ) : !dogs?.length ? (
        <Card raised onPress={() => router.push('/dog/form')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <IconBox bg={colors.accentSoft}>
              <Plus size={22} color={colors.accent} />
            </IconBox>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{t('home.addDog')}</Text>
              <Text variant="caption" tone="muted">{t('home.noDog')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </View>
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {dogs.map((dog) => {
            const breed = getBreed(dog.breedId);
            const age = dogAge(dog.birthDate, i18n.language);
            return (
              <Card key={dog.id} raised onPress={() => router.push(`/dog/${dog.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <DogAvatar avatarPath={dog.avatarPath} size={52} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyStrong">{dog.name}</Text>
                    <Text variant="caption" tone="muted">
                      {[
                        breed ? (i18n.language === 'en' ? breed.nameEn : breed.nameDe) : null,
                        age,
                      ]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* Rassen entdecken — Foto-Karussell */}
      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader
          title={t('home.discoverBreeds')}
          actionLabel={t('home.seeAll')}
          onAction={() => router.push('/(tabs)/breeds')}
        />
        <FlatList
          horizontal
          data={featured}
          keyExtractor={(b) => b.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/breed/${item.id}`)}
              style={({ pressed }) => ({
                width: 152,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                overflow: 'hidden',
                opacity: pressed ? 0.85 : 1,
                ...(elevation.low as object),
              })}
            >
              <BreedImage breedId={item.id} height={104} rounded={0} />
              <View style={{ padding: spacing.md, gap: 2 }}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {i18n.language === 'en' ? item.nameEn : item.nameDe}
                </Text>
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {item.origin}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* Tipp des Tages */}
      <View
        style={{
          marginTop: spacing.xl,
          backgroundColor: colors.accentSoft,
          borderRadius: radius.lg,
          padding: spacing.lg,
          flexDirection: 'row',
          gap: spacing.md,
        }}
      >
        <Lightbulb size={22} color={colors.accent} />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text variant="label" style={{ color: colors.accent }}>
            {t('home.tipOfDay').toUpperCase()}
          </Text>
          <Text variant="body">{tip}</Text>
        </View>
      </View>

      {/* Entdecken */}
      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title={t('home.explore')} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <FeatureTile
            icon={<DogIcon size={24} color={colors.accent} />}
            title={t('home.breedsTile')}
            subtitle={t('home.breedsTileSub', { count: breedCount })}
            onPress={() => router.push('/(tabs)/breeds')}
          />
          <FeatureTile
            icon={<User size={24} color={colors.accent} />}
            title={t('home.profileTile')}
            subtitle={t('home.profileTileSub')}
            onPress={() => router.push('/(tabs)/profile')}
          />
        </View>
      </View>
    </Screen>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
      }}
    >
      <Text variant="heading">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text variant="caption" tone="accent">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function IconBox({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

function FeatureTile({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
        opacity: pressed ? 0.85 : 1,
        ...(elevation.low as object),
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          backgroundColor: colors.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ gap: 2 }}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption" tone="muted">{subtitle}</Text>
      </View>
    </Pressable>
  );
}
