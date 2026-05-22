import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { layout, useTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
};

/** Bildschirm-Wrapper: Safe-Area, Hintergrundfarbe, optional scrollbar. */
export function Screen({
  children,
  scroll,
  padded = true,
  edges = ['top'],
  contentStyle,
}: Props) {
  const { colors } = useTheme();
  const pad: ViewStyle = padded ? { padding: layout.screenPadding } : {};

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1 }, pad, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
