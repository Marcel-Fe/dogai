import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Dog as DogIcon,
  Lightbulb,
  Plus,
  ScanLine,
  Sparkles,
  User,
} from 'lucide-react-native';
import { Card, Screen, Skeleton, Text } from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import { DemoNotice } from '@/components/common/DemoNotice';
import { useAuth } from '@/features/auth/AuthContext';
import { useDogs } from '@/features/dogs/api';
import { breedCount, getBreed } from '@/data/breeds';
import { isDemoMode } from '@/lib/env';
import { dogAge } from '@/utils/format';
import { dailyTip } from '@/utils/dailyTip';
import { elevation, radius, spacing, useTheme } from '@/theme';

export default function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: dogs, isLoading } = useDogs();

  const greetingName = user?.email?.split('@')[0] ?? '';
  const tip = dailyTip(i18n.language);

  return (
    <Screen scroll>
      {/* Begrüßung */}
      <View style={{ marginBottom: spacing.xl }}>
        <Text variant="caption" tone="muted">{t('home.greeting')}</Text>
        <Text variant="title">{greetingName} 👋</Text>
        <Text variant="body" tone="muted">{t('home.subtitle')}</Text>
      </View>

      {isDemoMode ? (
        <View style={{ marginBottom: spacing.xl }}>
          <DemoNotice feature="KI-Chat & Bilderkennung" />
        </View>
      ) : null}

      {/* Meine Hunde */}
      <SectionTitle text={t('home.myDogs')} />
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
        <SectionTitle text={t('home.explore')} />
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <FeatureTile
              icon={<ScanLine size={24} color={colors.accent} />}
              title={t('home.quickScan')}
              subtitle={t('home.quickScanSub')}
              onPress={() => router.push('/(tabs)/scan')}
            />
            <FeatureTile
              icon={<Sparkles size={24} color={colors.accent} />}
              title={t('home.askAi')}
              subtitle={t('home.askAiSub')}
              onPress={() => router.push('/(tabs)/assistant')}
            />
          </View>
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
      </View>
    </Screen>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <Text variant="heading" style={{ marginBottom: spacing.md }}>
      {text}
    </Text>
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
