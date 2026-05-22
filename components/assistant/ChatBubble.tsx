import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Text } from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';

type Props = {
  role: 'user' | 'assistant';
  content: string;
};

/** Eine Chat-Nachricht. Assistenten-Antworten werden als Markdown gerendert. */
export function ChatBubble({ role, content }: Props) {
  const { colors } = useTheme();
  const isUser = role === 'user';

  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '88%',
        backgroundColor: isUser ? colors.accent : colors.surface,
        borderWidth: isUser ? 0 : 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        borderBottomRightRadius: isUser ? 4 : radius.lg,
        borderBottomLeftRadius: isUser ? radius.lg : 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      {isUser ? (
        <Text variant="body" tone="inverse">{content}</Text>
      ) : content.length === 0 ? (
        <Text variant="body" tone="muted">…</Text>
      ) : (
        <Markdown
          style={{
            body: { color: colors.text, fontSize: 16, lineHeight: 23 },
            paragraph: { marginTop: 0, marginBottom: spacing.sm },
            bullet_list: { marginBottom: spacing.sm },
            strong: { color: colors.text, fontWeight: '700' },
            link: { color: colors.accent },
          }}
        >
          {content}
        </Markdown>
      )}
    </View>
  );
}
