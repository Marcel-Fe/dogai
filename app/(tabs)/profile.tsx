import { Alert, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Plus, Globe, ShieldCheck, LogOut } from 'lucide-react-native';
import { Button, Card, EmptyState, Screen, Skeleton, Text, useToast } from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import { useAuth } from '@/features/auth/AuthContext';
import { useDogs } from '@/features/dogs/api';
import { getBreed } from '@/data/breeds';
import { supabase } from '@/lib/supabase';
import { isDemoMode } from '@/lib/env';
import { changeLanguage, type Language } from '@/lib/i18n';
import { dogAge } from '@/utils/format';
import { spacing, useTheme } from '@/theme';

export default function Profile() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const toast = useToast();
  const { data: dogs, isLoading } = useDogs();

  function toggleLanguage() {
    const next: Language = i18n.language === 'de' ? 'en' : 'de';
    changeLanguage(next);
  }

  async function exportData() {
    if (isDemoMode) {
      toast.show('Im Demo-Modus nicht verfügbar — braucht ein Backend.', 'info');
      return;
    }
    const tables = ['dogs', 'vaccinations', 'medications', 'health_records', 'scans'] as const;
    const dump: Record<string, unknown> = { exportedAt: new Date().toISOString(), email: user?.email };
    for (const tbl of tables) {
      const { data } = await supabase.from(tbl).select('*');
      dump[tbl] = data ?? [];
    }
    // MVP: Export im Log; in Phase 2 als Datei teilen (expo-sharing).
    console.log('DSGVO-Datenexport', JSON.stringify(dump, null, 2));
    toast.show(i18n.language === 'de' ? 'Export erstellt (siehe Log).' : 'Export created (see log).', 'success');
  }

  function confirmDelete() {
    if (isDemoMode) {
      toast.show('Im Demo-Modus nicht verfügbar — braucht ein Backend.', 'info');
      return;
    }
    Alert.alert(t('profile.deleteAccount'), t('profile.deleteAccountConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.functions.invoke('delete-user');
          if (error) {
            toast.show(t('common.error'), 'error');
            return;
          }
          await signOut();
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginBottom: spacing.xs }}>
        {t('profile.title')}
      </Text>
      <Text variant="caption" tone="muted" style={{ marginBottom: spacing.xl }}>
        {user?.email}
      </Text>

      {/* Hunde */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
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
        <View style={{ gap: spacing.sm }}>
          <Skeleton height={72} radius={16} />
          <Skeleton height={72} radius={16} />
        </View>
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
                      {[breed ? (i18n.language === 'en' ? breed.nameEn : breed.nameDe) : null, age]
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
        <Divider />
        <SettingRow
          icon={<ShieldCheck size={20} color={colors.textMuted} />}
          label={t('profile.exportData')}
          onPress={exportData}
        />
      </Card>

      <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
        {isDemoMode ? null : (
          <Button
            label={t('auth.logout')}
            variant="secondary"
            onPress={signOut}
            icon={<LogOut size={18} color={colors.text} />}
          />
        )}
        <Pressable onPress={confirmDelete} style={{ alignItems: 'center', padding: spacing.md }}>
          <Text variant="caption" tone="danger">{t('profile.deleteAccount')}</Text>
        </Pressable>
      </View>
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

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: spacing.xxl }} />;
}
