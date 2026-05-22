import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Input, Screen, Text, useToast } from '@/components/ui';
import { VetWarning } from '@/components/common/VetWarning';
import { useAuth } from '@/features/auth/AuthContext';
import { spacing } from '@/theme';

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 8;

  async function submit() {
    setError(null);
    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    toast.show(t('auth.checkEmail'), 'success');
    router.replace('/(auth)/login');
  }

  return (
    <Screen edges={['top', 'bottom']} scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ gap: spacing.xl, paddingTop: spacing.xxl }}>
          <View style={{ gap: spacing.xs }}>
            <Text variant="title">{t('auth.register')}</Text>
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
              autoComplete="new-password"
              textContentType="newPassword"
              hint="Mindestens 8 Zeichen"
              error={
                error ?? (passwordTooShort ? 'Passwort zu kurz (min. 8 Zeichen)' : undefined)
              }
            />
          </View>

          <Button
            label={t('auth.register')}
            onPress={submit}
            loading={loading}
            disabled={!email || password.length < 8}
            fullWidth
          />

          <VetWarning />

          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            style={{ alignItems: 'center', padding: spacing.sm }}
          >
            <Text variant="body" tone="muted">
              {t('auth.hasAccount')}{' '}
              <Text variant="bodyStrong" tone="accent">{t('auth.login')}</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
