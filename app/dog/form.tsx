import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import { Button, Header, Input, Screen, Text, useToast } from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import { BreedPickerSheet } from '@/components/dog/BreedPickerSheet';
import { useCreateDog, useDog, useUpdateDog, type DogInput } from '@/features/dogs/api';
import { getBreed } from '@/data/breeds';
import { uploadImage } from '@/lib/upload';
import { radius, spacing, useTheme } from '@/theme';

export default function DogForm() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const { data: existing } = useDog(id);
  const createDog = useCreateDog();
  const updateDog = useUpdateDog();

  const [name, setName] = useState('');
  const [breedId, setBreedId] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'m' | 'f' | null>(null);
  const [neutered, setNeutered] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Bestehenden Hund einmalig in das Formular laden.
  if (isEdit && existing && !hydrated) {
    setName(existing.name);
    setBreedId(existing.breedId);
    setBirthDate(existing.birthDate ?? '');
    setWeight(existing.weightKg ? String(existing.weightKg) : '');
    setSex(existing.sex);
    setNeutered(!!existing.neutered);
    setAvatarPath(existing.avatarPath);
    setHydrated(true);
  }

  const breed = getBreed(breedId);

  async function pickAvatar() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (res.canceled) return;
    setLocalAvatar(res.assets[0].uri);
  }

  async function save() {
    if (!name.trim()) {
      toast.show(i18n.language === 'de' ? 'Bitte einen Namen eingeben.' : 'Please enter a name.', 'error');
      return;
    }
    setBusy(true);
    try {
      let finalAvatar = avatarPath;
      if (localAvatar) {
        finalAvatar = await uploadImage('dog-avatars', localAvatar);
      }
      const input: DogInput = {
        name: name.trim(),
        breedId,
        birthDate: birthDate.trim() || null,
        weightKg: weight ? Number(weight.replace(',', '.')) : null,
        sex,
        neutered,
        avatarPath: finalAvatar,
      };
      if (isEdit && id) {
        await updateDog.mutateAsync({ id, input });
      } else {
        await createDog.mutateAsync(input);
      }
      toast.show(t('common.done'), 'success');
      router.back();
    } catch {
      toast.show(t('common.error'), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <Header title={isEdit ? t('dog.editDog') : t('dog.addDog')} />

      <View style={{ alignItems: 'center', marginVertical: spacing.lg }}>
        <Pressable onPress={pickAvatar} accessibilityLabel={t('scan.fromGallery')}>
          {localAvatar ? (
            <Image
              source={{ uri: localAvatar }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              contentFit="cover"
            />
          ) : (
            <DogAvatar avatarPath={avatarPath} size={96} />
          )}
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              backgroundColor: colors.accent,
              borderRadius: radius.pill,
              padding: spacing.sm,
            }}
          >
            <Camera size={16} color={colors.accentText} />
          </View>
        </Pressable>
        {localAvatar ? (
          <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
            {i18n.language === 'de' ? 'Foto wird beim Speichern hochgeladen' : 'Photo uploads on save'}
          </Text>
        ) : null}
      </View>

      <View style={{ gap: spacing.lg }}>
        <Input label={t('dog.name')} value={name} onChangeText={setName} />

        <Pressable onPress={() => setPickerOpen(true)}>
          <Input
            label={t('dog.breed')}
            value={breed ? (i18n.language === 'en' ? breed.nameEn : breed.nameDe) : ''}
            placeholder={t('dog.selectBreed')}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        <Input
          label={t('dog.birthDate')}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          hint={i18n.language === 'de' ? 'Format: Jahr-Monat-Tag' : 'Format: year-month-day'}
        />

        <Input
          label={t('dog.weight')}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="0.0"
        />

        <View style={{ gap: spacing.xs }}>
          <Text variant="label" tone="muted">{t('dog.sex').toUpperCase()}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <SexButton label={t('dog.sex_m')} active={sex === 'm'} onPress={() => setSex('m')} />
            <SexButton label={t('dog.sex_f')} active={sex === 'f'} onPress={() => setSex('f')} />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant="body">{t('dog.neutered')}</Text>
          <Switch
            value={neutered}
            onValueChange={setNeutered}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <Button label={t('common.save')} onPress={save} loading={busy} fullWidth />
      </View>

      <BreedPickerSheet
        visible={pickerOpen}
        selectedId={breedId}
        onSelect={setBreedId}
        onClose={() => setPickerOpen(false)}
      />
    </Screen>
  );
}

function SexButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        height: 48,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: active ? colors.accent : colors.border,
        backgroundColor: active ? colors.accentSoft : colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text variant="bodyStrong" tone={active ? 'accent' : 'default'}>
        {label}
      </Text>
    </Pressable>
  );
}
