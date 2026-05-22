import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PawPrint } from 'lucide-react-native';
import { Button, Screen, Text } from '@/components/ui';
import { spacing, useTheme } from '@/theme';

export default function Welcome() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xxl }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PawPrint size={48} color={colors.accent} />
          </View>
          <Text variant="display" center>{t('auth.welcomeTitle')}</Text>
          <Text variant="body" tone="muted" center style={{ maxWidth: 300 }}>
            {t('auth.welcomeSubtitle')}
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Button
            label={t('auth.register')}
            onPress={() => router.push('/(auth)/register')}
            fullWidth
          />
          <Button
            label={t('auth.login')}
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}
