import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Input, Screen, Text } from '@/components/ui';
import { AVATARS, useProfile } from '@/features/profile/store';
import { radius, spacing, useTheme } from '@/theme';

/** Erstkontakt: lokales Profil anlegen (Name + Avatar) — kein Konto, kein Server. */
export default function Welcome() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const setProfile = useProfile((s) => s.setProfile);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const canStart = name.trim().length > 0;

  function start() {
    if (!canStart) return;
    setProfile(name, avatar);
    router.replace('/(tabs)');
  }

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingVertical: spacing.xl, gap: spacing.xl }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ fontSize: 68, lineHeight: 78 }}>{avatar}</Text>
          <Text variant="display" center>{t('auth.welcomeTitle')}</Text>
          <Text variant="body" tone="muted" center style={{ maxWidth: 300 }}>
            {t('auth.welcomeSubtitle')}
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <Input
            label={t('auth.namePrompt')}
            placeholder={t('auth.namePlaceholder')}
            value={name}
            onChangeText={setName}
            maxLength={24}
            returnKeyType="done"
            onSubmitEditing={start}
          />

          <View style={{ gap: spacing.sm }}>
            <Text variant="label" tone="muted">{t('auth.pickAvatar').toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {AVATARS.map((a) => {
                const active = a === avatar;
                return (
                  <Pressable
                    key={a}
                    accessibilityRole="button"
                    onPress={() => setAvatar(a)}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: radius.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: active ? colors.accentSoft : colors.surface,
                      borderWidth: 1.5,
                      borderColor: active ? colors.accent : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 28, lineHeight: 34 }}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: spacing.xl }} />
        <Button label={t('auth.start')} onPress={start} disabled={!canStart} fullWidth />
      </View>
    </Screen>
  );
}
