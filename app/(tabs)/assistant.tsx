import { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react-native';
import { Screen, Text } from '@/components/ui';
import {
  advisorCategories,
  advisorEntries,
  findAnswer,
  type AdvisorCategory,
} from '@/data/advisor';
import { radius, spacing, useTheme } from '@/theme';

type Msg = { id: string; role: 'user' | 'advisor'; text: string };

/** Eingebauter Hunde-Berater — kuratierte Wissensbasis, offline, ohne Konto. */
export default function Assistant() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const en = i18n.language === 'en';
  const scrollRef = useRef<ScrollView>(null);
  const counter = useRef(0);

  const [messages, setMessages] = useState<Msg[]>([
    { id: 'greeting', role: 'advisor', text: t('advisor.greeting') },
  ]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<AdvisorCategory>('nutrition');

  function ask(question: string) {
    const text = question.trim();
    if (!text) return;
    const entry = findAnswer(text);
    const answer = entry ? (en ? entry.answerEn : entry.answerDe) : t('advisor.noAnswer');
    counter.current += 1;
    const n = counter.current;
    setMessages((m) => [
      ...m,
      { id: `u${n}`, role: 'user', text },
      { id: `a${n}`, role: 'advisor', text: answer },
    ]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  }

  const suggestions = advisorEntries.filter((e) => e.category === category);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
        <Text variant="title">{t('advisor.title')}</Text>
        <Text variant="caption" tone="muted">{t('advisor.intro')}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} />
        ))}

        <Text variant="label" tone="muted" style={{ marginTop: spacing.md }}>
          {t('advisor.suggestions').toUpperCase()}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {advisorCategories.map((c) => {
            const active = c.key === category;
            return (
              <Pressable
                key={c.key}
                onPress={() => setCategory(c.key)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                  backgroundColor: active ? colors.accent : colors.surfaceAlt,
                }}
              >
                <Text variant="caption" tone={active ? 'inverse' : 'muted'}>
                  {en ? c.en : c.de}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ gap: spacing.sm }}>
          {suggestions.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => ask(en ? s.questionEn : s.questionDe)}
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.md,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text variant="body">{en ? s.questionEn : s.questionDe}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
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
          placeholder={t('advisor.placeholder')}
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={() => ask(input)}
          returnKeyType="send"
          style={{
            flex: 1,
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            color: colors.text,
            fontSize: 16,
          }}
        />
        <Pressable
          onPress={() => ask(input)}
          accessibilityRole="button"
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={20} color={colors.accentText} />
        </Pressable>
      </View>
    </Screen>
  );
}

function Bubble({ role, text }: { role: 'user' | 'advisor'; text: string }) {
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      <Text variant="body" style={{ color: isUser ? colors.accentText : colors.text }}>
        {text}
      </Text>
    </View>
  );
}
