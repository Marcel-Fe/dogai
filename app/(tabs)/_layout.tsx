import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '@/components/navigation/TabBar';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ tabBarLabel: t('tabs.home') }} />
      <Tabs.Screen name="breeds" options={{ tabBarLabel: t('tabs.breeds') }} />
      <Tabs.Screen name="scan" options={{ tabBarLabel: t('tabs.scan') }} />
      <Tabs.Screen name="assistant" options={{ tabBarLabel: t('tabs.assistant') }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: t('tabs.profile') }} />
    </Tabs>
  );
}
