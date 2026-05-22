import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Input, Screen, Text } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { spacing } from '@/theme';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) setError(error);
    // Bei Erfolg übernimmt der AuthGate die Navigation.
  }

  return (
    <Screen edges={['top', 'bottom']} scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ gap: spacing.xl, paddingTop: spacing.xxl }}>
          <View style={{ gap: spacing.xs }}>
            <Text variant="title">{t('auth.login')}</Text>
            <Text variant="body" tone="muted">{t('auth.welcomeSubtitle')}</Text>
          </View>

          <View style={{ gap: spacing.md }}>
            <Input
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <Input
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              error={error ?? undefined}
            />
          </View>

          <Button
            label={t('auth.login')}
            onPress={submit}
            loading={loading}
            disabled={!email || !password}
            fullWidth
          />

          <Pressable
            onPress={() => router.replace('/(auth)/register')}
            style={{ alignItems: 'center', padding: spacing.sm }}
          >
            <Text variant="body" tone="muted">
              {t('auth.noAccount')}{' '}
              <Text variant="bodyStrong" tone="accent">{t('auth.register')}</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
