import { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Heart, Search } from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { BreedImage } from '@/components/breed/BreedImage';
import { useProfile } from '@/features/profile/store';
import { breedCount, breeds, fciGroups } from '@/data/breeds';
import { formatRange } from '@/utils/format';
import { radius, spacing, useTheme } from '@/theme';

export default function Breeds() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<number | null>(null);
  const [favOnly, setFavOnly] = useState(false);
  const favorites = useProfile((s) => s.favorites);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return breeds.filter((b) => {
      if (favOnly && !favorites.includes(b.id)) return false;
      if (group !== null && b.fciGroup !== group) return false;
      if (!q) return true;
      return (
        b.nameDe.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q)
      );
    });
  }, [query, group, favOnly, favorites]);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <Text variant="title">{t('breeds.title')}</Text>
        <Text variant="caption" tone="muted" style={{ marginBottom: spacing.md }}>
          {breedCount} {i18n.language === 'de' ? 'Rassen' : 'breeds'}
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
            }}
          >
            <Search size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('breeds.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              style={{ flex: 1, paddingVertical: spacing.md, color: colors.text, fontSize: 16 }}
            />
          </View>
          <Pressable
            onPress={() => setFavOnly((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={t('breeds.favorites')}
            style={{
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.md,
              borderWidth: 1,
              backgroundColor: favOnly ? colors.accent : colors.surface,
              borderColor: favOnly ? colors.accent : colors.border,
            }}
          >
            <Heart
              size={18}
              color={favOnly ? colors.accentText : colors.textMuted}
              fill={favOnly ? colors.accentText : 'transparent'}
            />
          </Pressable>
        </View>
      </View>

      {/* FCI-Gruppen-Filter */}
      <FlatList
        horizontal
        data={[{ group: -1, name: t('breeds.allGroups') }, ...fciGroups]}
        keyExtractor={(g) => String(g.group)}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginTop: spacing.md }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => {
          const value = item.group === -1 ? null : item.group;
          const active = group === value;
          return (
            <Pressable
              onPress={() => setGroup(value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.pill,
                backgroundColor: active ? colors.accent : colors.surfaceAlt,
              }}
            >
              <Text variant="caption" tone={active ? 'inverse' : 'muted'}>
                {item.group === -1 ? item.name : `Gruppe ${item.group}`}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text variant="body" tone="muted" center style={{ marginTop: spacing.xxl }}>
            {i18n.language === 'de' ? 'Keine Rasse gefunden.' : 'No breed found.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Card padded={false} onPress={() => router.push(`/breed/${item.id}`)}>
            <BreedImage breedId={item.id} height={150} rounded={0} />
            <View style={{ padding: spacing.md, gap: 2 }}>
              <Text variant="bodyStrong">
                {i18n.language === 'en' ? item.nameEn : item.nameDe}
              </Text>
              <Text variant="caption" tone="muted">
                {item.origin} · {formatRange(item.weightKg, 'kg')} ·{' '}
                {formatRange(item.lifespanYears, t('breeds.years'))}
              </Text>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
