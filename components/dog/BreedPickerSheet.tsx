import { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, Search } from 'lucide-react-native';
import { Sheet, Text } from '@/components/ui';
import { searchBreeds } from '@/data/breeds';
import { radius, spacing, useTheme } from '@/theme';

type Props = {
  visible: boolean;
  selectedId: string | null;
  onSelect: (breedId: string) => void;
  onClose: () => void;
};

/** Durchsuchbare Auswahl aus allen Rassen — für das Hundeprofil-Formular. */
export function BreedPickerSheet({ visible, selectedId, onSelect, onClose }: Props) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchBreeds(query), [query]);

  return (
    <Sheet visible={visible} onClose={onClose} title={t('dog.selectBreed')}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          marginBottom: spacing.md,
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

      <FlatList
        data={results}
        keyExtractor={(b) => b.id}
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 400 }}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.md,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <View style={{ flex: 1 }}>
                <Text variant="body">{i18n.language === 'en' ? item.nameEn : item.nameDe}</Text>
                <Text variant="caption" tone="muted">{item.fciGroupName}</Text>
              </View>
              {selected ? <Check size={20} color={colors.accent} /> : null}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.border }} />
        )}
      />
    </Sheet>
  );
}
