import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from './Text';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
};

/** Text-Eingabefeld mit Label, Fokus-Rahmen und Fehleranzeige. */
export function Input({ label, error, hint, style, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.accent : colors.border;

  return (
    <View style={{ gap: spacing.xs }}>
      {label ? <Text variant="label" tone="muted">{label.toUpperCase()}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          {
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            fontSize: 16,
            color: colors.text,
            minHeight: 48,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" tone="danger">{error}</Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">{hint}</Text>
      ) : null}
    </View>
  );
}
