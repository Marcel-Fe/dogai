import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, ImagePlus, History } from 'lucide-react-native';
import { Button, Card, Screen, Sheet, Text, useToast } from '@/components/ui';
import { VetWarning } from '@/components/common/VetWarning';
import { DemoNotice } from '@/components/common/DemoNotice';
import { ScanResultView } from '@/components/scan/ScanResultView';
import { isDemoMode } from '@/lib/env';
import { createScanRecord, useInvalidateScans, useScans } from '@/features/scan/api';
import { useDogs } from '@/features/dogs/api';
import { runVision } from '@/lib/claude';
import { uploadImage } from '@/lib/upload';
import { cacheGet, cacheSet } from '@/lib/storage';
import { formatDate } from '@/utils/format';
import { radius, spacing, useTheme } from '@/theme';
import type { ScanCategory, ScanResult } from '@/types';

const CATEGORIES: ScanCategory[] = ['skin', 'wound', 'coat', 'eye', 'tick', 'allergy'];

export default function Scan() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { data: dogs } = useDogs();
  const { data: scans } = useScans();
  const invalidateScans = useInvalidateScans();

  const [consentChecked, setConsentChecked] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [category, setCategory] = useState<ScanCategory>('skin');
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    cacheGet<boolean>('scanConsent').then((ok) => {
      setConsentChecked(true);
      if (!ok) setConsentOpen(true);
    });
  }, []);

  async function acceptConsent() {
    await cacheSet('scanConsent', true);
    setConsentOpen(false);
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      toast.show(i18n.language === 'de' ? 'Kamerazugriff nötig.' : 'Camera access needed.', 'error');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
    if (!res.canceled) {
      setPhoto(res.assets[0].uri);
      setResult(null);
    }
  }

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });
    if (!res.canceled) {
      setPhoto(res.assets[0].uri);
      setResult(null);
    }
  }

  async function analyze() {
    if (!photo) return;
    if (isDemoMode) {
      toast.show('Demo-Modus: Die KI-Bilderkennung braucht ein verbundenes Backend.', 'info');
      return;
    }
    setAnalyzing(true);
    try {
      const storagePath = await uploadImage('scan-photos', photo);
      const scanId = await createScanRecord(storagePath, category, dogs?.[0]?.id ?? null);
      const res = await runVision({ scanId, storagePath, category, locale: i18n.language });
      setResult(res);
      invalidateScans();
    } catch {
      toast.show(t('common.error'), 'error');
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setPhoto(null);
    setResult(null);
  }

  return (
    <Screen scroll>
      <Text variant="title">{t('scan.title')}</Text>
      <Text variant="caption" tone="muted" style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
        {t('scan.intro')}
      </Text>

      {isDemoMode ? (
        <View style={{ marginBottom: spacing.lg }}>
          <DemoNotice feature="Die KI-Bilderkennung" />
        </View>
      ) : null}

      {result ? (
        <View style={{ gap: spacing.lg }}>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: '100%', height: 200, borderRadius: radius.lg }}
              contentFit="cover"
            />
          ) : null}
          <ScanResultView result={result} />
          <Button label={t('scan.title')} variant="secondary" onPress={reset} fullWidth />
        </View>
      ) : (
        <>
          {/* Kategorie */}
          <Text variant="label" tone="muted" style={{ marginBottom: spacing.sm }}>
            {t('scan.category').toUpperCase()}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: radius.pill,
                    backgroundColor: active ? colors.accent : colors.surfaceAlt,
                  }}
                >
                  <Text variant="caption" tone={active ? 'inverse' : 'muted'}>
                    {t(`scan.category_${c}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Foto */}
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: '100%', height: 240, borderRadius: radius.lg, marginBottom: spacing.md }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                height: 200,
                borderRadius: radius.lg,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Camera size={40} color={colors.textMuted} />
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              label={t('scan.takePhoto')}
              onPress={takePhoto}
              variant="secondary"
              icon={<Camera size={18} color={colors.text} />}
              style={{ flex: 1 }}
            />
            <Button
              label={t('scan.fromGallery')}
              onPress={pickPhoto}
              variant="secondary"
              icon={<ImagePlus size={18} color={colors.text} />}
              style={{ flex: 1 }}
            />
          </View>

          {photo ? (
            <View style={{ marginTop: spacing.md }}>
              <Button
                label={analyzing ? t('scan.analyzing') : t('scan.analyze')}
                onPress={analyze}
                loading={analyzing}
                fullWidth
              />
            </View>
          ) : null}

          <View style={{ marginTop: spacing.lg }}>
            <VetWarning />
          </View>
        </>
      )}

      {/* Verlauf */}
      {scans && scans.length > 0 ? (
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <History size={18} color={colors.textMuted} />
            <Text variant="heading">{t('scan.history')}</Text>
          </View>
          <View style={{ gap: spacing.sm }}>
            {scans.slice(0, 8).map((s) => (
              <Card key={s.id} onPress={() => router.push(`/scan/${s.id}`)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="bodyStrong">{t(`scan.category_${s.category}`)}</Text>
                  <Text variant="caption" tone="muted">
                    {formatDate(s.createdAt, i18n.language)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      ) : null}

      {/* Consent */}
      <Sheet visible={consentChecked && consentOpen} onClose={acceptConsent} title={t('scan.consentTitle')}>
        <Text variant="body" tone="muted" style={{ marginBottom: spacing.lg }}>
          {t('scan.consentText')}
        </Text>
        <Button label={t('scan.consentAccept')} onPress={acceptConsent} fullWidth />
      </Sheet>
    </Screen>
  );
}
