import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Header, Screen, Skeleton, Text } from '@/components/ui';
import { ScanResultView } from '@/components/scan/ScanResultView';
import { VetWarning } from '@/components/common/VetWarning';
import { useScan } from '@/features/scan/api';
import { signedUrl } from '@/lib/supabase';
import { formatDate } from '@/utils/format';
import { radius, spacing } from '@/theme';

export default function ScanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { data: scan, isLoading } = useScan(id);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (scan?.storagePath) {
      signedUrl('scan-photos', scan.storagePath).then(setPhotoUrl);
    }
  }, [scan?.storagePath]);

  return (
    <Screen scroll>
      <Header title={scan ? t(`scan.category_${scan.category}`) : t('scan.title')} />

      {isLoading ? (
        <Skeleton height={200} radius={16} />
      ) : !scan ? (
        <Text variant="body" tone="muted">{t('common.error')}</Text>
      ) : (
        <View style={{ gap: spacing.lg }}>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={{ width: '100%', height: 220, borderRadius: radius.lg }}
              contentFit="cover"
            />
          ) : (
            <Skeleton height={220} radius={16} />
          )}
          <Text variant="caption" tone="muted">
            {formatDate(scan.createdAt, i18n.language)}
          </Text>

          {scan.result ? (
            <ScanResultView result={scan.result} />
          ) : (
            <>
              <Text variant="body" tone="muted">
                {i18n.language === 'de'
                  ? 'Für diesen Scan liegt kein Ergebnis vor.'
                  : 'No result available for this scan.'}
              </Text>
              <VetWarning />
            </>
          )}
        </View>
      )}
    </Screen>
  );
}
