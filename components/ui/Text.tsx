import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { fontSize, fontWeight, useTheme } from '@/theme';

type Variant =
  | 'display'
  | 'title'
  | 'heading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label';

type Tone = 'default' | 'muted' | 'accent' | 'danger' | 'success' | 'inverse';

type Props = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  center?: boolean;
};

type VariantStyle = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
};

const variantStyle: Record<Variant, VariantStyle> = {
  display: { fontSize: fontSize.display, fontWeight: fontWeight.bold, lineHeight: 42 },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, lineHeight: 34 },
  heading: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, lineHeight: 28 },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 23 },
  bodyStrong: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, lineHeight: 23 },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, lineHeight: 19 },
  label: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, lineHeight: 16 },
};

/** Einheitliche Typografie. Nutze immer dieses Text statt RN-Text. */
export function Text({ variant = 'body', tone = 'default', center, style, ...rest }: Props) {
  const { colors } = useTheme();
  const toneColor: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
    inverse: colors.textInverse,
  };
  const v = variantStyle[variant];
  return (
    <RNText
      style={[
        {
          fontSize: v.fontSize,
          fontWeight: v.fontWeight,
          lineHeight: v.lineHeight,
          color: toneColor[tone],
          letterSpacing: variant === 'label' ? 0.5 : 0,
        },
        center ? { textAlign: 'center' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
