import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useProfile } from '@/features/profile/store';
import { useTheme } from '@/theme';

/**
 * Einstiegs-Route. Leitet anhand des lokalen Profils weiter:
 * kein Name → Onboarding, sonst → App. <Redirect> wartet sicher,
 * bis der Navigator bereit ist.
 */
export default function Index() {
  const hydrated = useProfile((s) => s.hydrated);
  const name = useProfile((s) => s.name);
  const { colors } = useTheme();

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <Redirect href={name ? '/(tabs)' : '/(auth)/welcome'} />;
}
