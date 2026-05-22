import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '@/components/navigation/TabBar';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ tabBarLabel: t('tabs.home') }} />
      <Tabs.Screen name="breeds" options={{ tabBarLabel: t('tabs.breeds') }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: t('tabs.profile') }} />
      {/* KI-Chat & Foto-Scan ausgeblendet: aus der Tab-Leiste entfernt (href: null). */}
      <Tabs.Screen name="scan" options={{ href: null }} />
      <Tabs.Screen name="assistant" options={{ href: null }} />
    </Tabs>
  );
}
