import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus, Syringe, Pill, Trash2 } from 'lucide-react-native';
import {
  Button,
  Card,
  Header,
  Input,
  Screen,
  Sheet,
  Skeleton,
  Text,
  useToast,
} from '@/components/ui';
import { DogAvatar } from '@/components/dog/DogAvatar';
import {
  useAddMedication,
  useAddVaccination,
  useDeleteDog,
  useDog,
  useMedications,
  useVaccinations,
} from '@/features/dogs/api';
import { getBreed } from '@/data/breeds';
import { dogAge, formatDate } from '@/utils/format';
import { spacing, useTheme } from '@/theme';

export default function DogDetail() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: dog, isLoading } = useDog(id);
  const { data: vaccinations } = useVaccinations(id);
  const { data: medications } = useMedications(id);
  const deleteDog = useDeleteDog();
  const addVaccination = useAddVaccination();
  const addMedication = useAddMedication();

  const [vaxOpen, setVaxOpen] = useState(false);
  const [medOpen, setMedOpen] = useState(false);

  if (isLoading) {
    return (
      <Screen>
        <Header />
        <Skeleton height={120} radius={16} />
      </Screen>
    );
  }
  if (!dog) {
    return (
      <Screen>
        <Header />
        <Text variant="body" tone="muted">{t('common.error')}</Text>
      </Screen>
    );
  }

  const breed = getBreed(dog.breedId);
  const age = dogAge(dog.birthDate, i18n.language);

  function confirmDelete() {
    Alert.alert(dog!.name, i18n.language === 'de' ? 'Profil löschen?' : 'Delete profile?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteDog.mutateAsync(dog!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <Header
        title={dog.name}
        right={
          <Pressable onPress={() => router.push(`/dog/form?id=${dog.id}`)} hitSlop={8}>
            <Pencil size={20} color={colors.accent} />
          </Pressable>
        }
      />

      <Card raised>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <DogAvatar avatarPath={dog.avatarPath} size={72} />
          <View style={{ flex: 1 }}>
            <Text variant="heading">{dog.name}</Text>
            {breed ? (
              <Pressable onPress={() => router.push(`/breed/${breed.id}`)}>
                <Text variant="caption" tone="accent">
                  {i18n.language === 'en' ? breed.nameEn : breed.nameDe}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm }}>
          <Stat label={t('dog.age')} value={age ?? '–'} />
          <Stat label={t('dog.weight')} value={dog.weightKg ? `${dog.weightKg} kg` : '–'} />
          <Stat
            label={t('dog.sex')}
            value={dog.sex ? t(`dog.sex_${dog.sex}`) : '–'}
          />
        </View>
      </Card>

      {/* Impfungen */}
      <SectionHeader
        icon={<Syringe size={18} color={colors.accent} />}
        title={t('dog.vaccinations')}
        onAdd={() => setVaxOpen(true)}
      />
      {!vaccinations?.length ? (
        <Text variant="caption" tone="muted">{t('dog.noVaccinations')}</Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {vaccinations.map((v) => (
            <Card key={v.id}>
              <Text variant="bodyStrong">{v.type}</Text>
              <Text variant="caption" tone="muted">
                {formatDate(v.date, i18n.language)}
                {v.nextDue
                  ? ` · ${i18n.language === 'de' ? 'nächste' : 'next'}: ${formatDate(v.nextDue, i18n.language)}`
                  : ''}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Medikamente */}
      <SectionHeader
        icon={<Pill size={18} color={colors.accent} />}
        title={t('dog.medications')}
        onAdd={() => setMedOpen(true)}
      />
      {!medications?.length ? (
        <Text variant="caption" tone="muted">{t('dog.noMedications')}</Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {medications.map((m) => (
            <Card key={m.id}>
              <Text variant="bodyStrong">{m.name}</Text>
              <Text variant="caption" tone="muted">
                {[m.dose, m.startDate ? formatDate(m.startDate, i18n.language) : null]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </Text>
            </Card>
          ))}
        </View>
      )}

      <Pressable
        onPress={confirmDelete}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          padding: spacing.lg,
          marginTop: spacing.xl,
        }}
      >
        <Trash2 size={16} color={colors.danger} />
        <Text variant="caption" tone="danger">{t('common.delete')}</Text>
      </Pressable>

      <VaccinationSheet
        visible={vaxOpen}
        onClose={() => setVaxOpen(false)}
        onSave={async (input) => {
          await addVaccination.mutateAsync({ dogId: dog.id, ...input });
          toast.show(t('common.done'), 'success');
        }}
      />
      <MedicationSheet
        visible={medOpen}
        onClose={() => setMedOpen(false)}
        onSave={async (input) => {
          await addMedication.mutateAsync({ dogId: dog.id, ...input });
          toast.show(t('common.done'), 'success');
        }}
      />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 12,
        padding: spacing.md,
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Text variant="bodyStrong">{value}</Text>
      <Text variant="label" tone="muted">{label.toUpperCase()}</Text>
    </View>
  );
}

function SectionHeader({
  icon,
  title,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  onAdd: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
      }}
    >
      {icon}
      <Text variant="heading" style={{ flex: 1 }}>{title}</Text>
      <Pressable onPress={onAdd} hitSlop={8}>
        <Plus size={22} color={colors.accent} />
      </Pressable>
    </View>
  );
}

function VaccinationSheet({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (input: { type: string; date: string; nextDue: string | null }) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [nextDue, setNextDue] = useState('');

  return (
    <Sheet visible={visible} onClose={onClose} title={t('dog.vaccinations')}>
      <View style={{ gap: spacing.md }}>
        <Input label={t('dog.vaccinationType')} value={type} onChangeText={setType} placeholder="z. B. Tollwut" />
        <Input label={t('dog.vaccinationDate')} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <Input label={t('dog.nextDue')} value={nextDue} onChangeText={setNextDue} placeholder="YYYY-MM-DD" />
        <Button
          label={t('common.save')}
          fullWidth
          disabled={!type.trim() || !date.trim()}
          onPress={async () => {
            await onSave({ type: type.trim(), date: date.trim(), nextDue: nextDue.trim() || null });
            setType('');
            setDate('');
            setNextDue('');
            onClose();
          }}
        />
      </View>
    </Sheet>
  );
}

function MedicationSheet({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (input: { name: string; dose: string | null; startDate: string | null }) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [startDate, setStartDate] = useState('');

  return (
    <Sheet visible={visible} onClose={onClose} title={t('dog.medications')}>
      <View style={{ gap: spacing.md }}>
        <Input label={t('dog.medicationName')} value={name} onChangeText={setName} />
        <Input label={t('dog.dose')} value={dose} onChangeText={setDose} placeholder="z. B. 1 Tbl. / Tag" />
        <Input label={t('dog.startDate')} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
        <Button
          label={t('common.save')}
          fullWidth
          disabled={!name.trim()}
          onPress={async () => {
            await onSave({ name: name.trim(), dose: dose.trim() || null, startDate: startDate.trim() || null });
            setName('');
            setDose('');
            setStartDate('');
            onClose();
          }}
        />
      </View>
    </Sheet>
  );
}
