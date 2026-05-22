import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Globe, Heart, Plus, RotateCcw } from 'lucide-react-native';
import { Card, EmptyState, Input, Screen, Skeleton, Text } from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import { useDogs } from '@/features/dogs/api';
import { AVATARS, useProfile } from '@/features/profile/store';
import { getBreed } from '@/data/breeds';
import { changeLanguage, type Language } from '@/lib/i18n';
import { accentOrder, accents } from '@/theme/accents';
import { dogAge } from '@/utils/format';
import { radius, spacing, useTheme } from '@/theme';

export default function Profile() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const { data: dogs, isLoading } = useDogs();

  const name = useProfile((s) => s.name);
  const avatar = useProfile((s) => s.avatar);
  const accent = useProfile((s) => s.accent);
  const favorites = useProfile((s) => s.favorites);
  const setProfile = useProfile((s) => s.setProfile);
  const setAccent = useProfile((s) => s.setAccent);
  const signOut = useProfile((s) => s.signOut);

  const [nameInput, setNameInput] = useState(name ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  function commitName() {
    const trimmed = nameInput.trim();
    if (trimmed) setProfile(trimmed, avatar);
    else setNameInput(name ?? '');
  }

  function toggleLanguage() {
    const next: Language = i18n.language === 'de' ? 'en' : 'de';
    changeLanguage(next);
  }

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginBottom: spacing.lg }}>{t('profile.title')}</Text>

      {/* Dein Profil */}
      <Card>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <Text style={{ fontSize: 56, lineHeight: 64 }}>{avatar}</Text>
          <View style={{ alignSelf: 'stretch' }}>
            <Input
              label={t('auth.namePrompt')}
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={commitName}
              maxLength={24}
              style={{ textAlign: 'center' }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing.sm,
              justifyContent: 'center',
            }}
          >
            {AVATARS.map((a) => {
              const active = a === avatar;
              return (
                <Pressable
                  key={a}
                  accessibilityRole="button"
                  onPress={() => setProfile(name ?? nameInput, a)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? colors.accentSoft : colors.surfaceAlt,
                    borderWidth: 1.5,
                    borderColor: active ? colors.accent : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 22, lineHeight: 28 }}>{a}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      {/* Akzentfarbe */}
      <Text variant="heading" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        {t('profile.accentColor')}
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {accentOrder.map((a) => {
            const swatch = accents[a][isDark ? 'dark' : 'light'].accent;
            const active = a === accent;
            return (
              <Pressable
                key={a}
                accessibilityRole="button"
                onPress={() => setAccent(a)}
                style={{ flex: 1, alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.pill,
                    backgroundColor: swatch,
                    borderWidth: 3,
                    borderColor: active ? colors.text : 'transparent',
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Lieblingsrassen */}
      <Text variant="heading" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        {t('profile.favorites')}
      </Text>
      <Card onPress={() => router.push('/(tabs)/breeds')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Heart size={20} color={colors.accent} />
          <Text variant="body" style={{ flex: 1 }}>
            {t('profile.favoritesCount', { count: favorites.length })}
          </Text>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </Card>

      {/* Hunde */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: spacing.xl,
          marginBottom: spacing.md,
        }}
      >
        <Text variant="heading">{t('profile.myDogs')}</Text>
        <Pressable
          onPress={() => router.push('/dog/form')}
          hitSlop={8}
          accessibilityLabel={t('dog.addDog')}
        >
          <Plus size={24} color={colors.accent} />
        </Pressable>
      </View>
      {isLoading ? (
        <Skeleton height={72} radius={radius.lg} />
      ) : !dogs?.length ? (
        <Card>
          <EmptyState
            title={t('home.noDog')}
            actionLabel={t('dog.addDog')}
            onAction={() => router.push('/dog/form')}
          />
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {dogs.map((dog) => {
            const breed = getBreed(dog.breedId);
            const age = dogAge(dog.birthDate, i18n.language);
            return (
              <Card key={dog.id} onPress={() => router.push(`/dog/${dog.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <DogAvatar avatarPath={dog.avatarPath} />
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

      {/* Einstellungen */}
      <Text variant="heading" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        {t('profile.settings')}
      </Text>
      <Card padded={false}>
        <SettingRow
          icon={<Globe size={20} color={colors.textMuted} />}
          label={t('profile.language')}
          value={i18n.language === 'de' ? 'Deutsch' : 'English'}
          onPress={toggleLanguage}
        />
      </Card>

      {/* Profil zurücksetzen */}
      <Pressable
        onPress={() => {
          if (confirmReset) signOut();
          else setConfirmReset(true);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          padding: spacing.lg,
          marginTop: spacing.lg,
        }}
      >
        <RotateCcw size={16} color={colors.danger} />
        <Text variant="caption" tone="danger">
          {confirmReset ? t('profile.resetConfirm') : t('profile.resetProfile')}
        </Text>
      </Pressable>
    </Screen>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {icon}
      <Text variant="body" style={{ flex: 1 }}>{label}</Text>
      {value ? <Text variant="caption" tone="muted">{value}</Text> : null}
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
}
