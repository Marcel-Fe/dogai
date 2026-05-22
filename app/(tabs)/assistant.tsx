import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Send, Sparkles } from 'lucide-react-native';
import { EmptyState, Text, useToast } from '@/components/ui';
import { ChatBubble } from '@/components/assistant/ChatBubble';
import { VetWarning } from '@/components/common/VetWarning';
import { DemoNotice } from '@/components/common/DemoNotice';
import { getOrCreateSession, loadMessages } from '@/features/assistant/api';
import { useDogs } from '@/features/dogs/api';
import { streamChat } from '@/lib/claude';
import { isDemoMode } from '@/lib/env';
import { radius, spacing, useTheme } from '@/theme';

type Msg = { id: string; role: 'user' | 'assistant'; content: string };

export default function Assistant() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { data: dogs } = useDogs();
  const listRef = useRef<FlatList<Msg>>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const activeDog = dogs?.[0] ?? null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getOrCreateSession(activeDog?.id ?? null);
        if (cancelled) return;
        setSessionId(id);
        const history = await loadMessages(id);
        if (!cancelled) {
          setMessages(history.map((m) => ({ id: m.id, role: m.role, content: m.content })));
        }
      } catch {
        if (!cancelled) toast.show(t('common.error'), 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
    // Session einmal pro Bildschirm-Lebenszyklus aufbauen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToEnd() {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  async function send() {
    const text = input.trim();
    if (!text || !sessionId || sending) return;
    if (isDemoMode) {
      toast.show('Demo-Modus: Der KI-Chat braucht ein verbundenes Backend.', 'info');
      return;
    }

    setInput('');
    setSending(true);

    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', content: text };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    scrollToEnd();

    try {
      await streamChat({
        sessionId,
        message: text,
        dogId: activeDog?.id ?? null,
        locale: i18n.language,
        onToken: (delta) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
          );
          scrollToEnd();
        },
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.content === ''
            ? { ...m, content: t('common.error') }
            : m,
        ),
      );
      toast.show(t('common.error'), 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Kopfzeile */}
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
        <Text variant="title">{t('assistant.title')}</Text>
        {activeDog ? (
          <Text variant="caption" tone="accent">
            {t('assistant.contextFor', { name: activeDog.name })}
          </Text>
        ) : null}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
          renderItem={({ item }) => <ChatBubble role={item.role} content={item.content} />}
          ListEmptyComponent={
            isDemoMode ? (
              <DemoNotice feature="Der KI-Chat" />
            ) : (
              <EmptyState
                icon={<Sparkles size={40} color={colors.accent} />}
                title={t('assistant.emptyTitle')}
                message={t('assistant.emptyMessage')}
              />
            )
          }
          ListFooterComponent={
            messages.length > 0 ? (
              <View style={{ marginTop: spacing.sm }}>
                <VetWarning />
              </View>
            ) : null
          }
        />

        {/* Eingabe */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: spacing.sm,
            padding: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t('assistant.placeholder')}
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              flex: 1,
              maxHeight: 120,
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              color: colors.text,
              fontSize: 16,
            }}
          />
          <Pressable
            onPress={send}
            disabled={!input.trim() || sending}
            accessibilityLabel={t('assistant.placeholder')}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.md,
              backgroundColor: input.trim() && !sending ? colors.accent : colors.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={20} color={input.trim() && !sending ? colors.accentText : colors.textMuted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
