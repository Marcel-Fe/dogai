import { View } from 'react-native';
import { spacing } from '@/theme';
import { Button } from './Button';
import { Text } from './Text';

type Props = {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Leerzustand mit Icon, Erklärung und optionaler Aktion. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        padding: spacing.xl,
      }}
    >
      {icon ? <View style={{ marginBottom: spacing.xs }}>{icon}</View> : null}
      <Text variant="heading" center>{title}</Text>
      {message ? (
        <Text variant="body" tone="muted" center>{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.sm }}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
