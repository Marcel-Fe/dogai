import { View } from 'react-native';
import { Image } from 'expo-image';
import { Dog as DogIcon } from 'lucide-react-native';
import { publicUrl } from '@/lib/supabase';
import { useTheme } from '@/theme';

type Props = {
  avatarPath: string | null | undefined;
  size?: number;
};

/** Erkennt eine direkte Bild-URI (Demo-Modus speichert lokale Pfade). */
function isDirectUri(path: string): boolean {
  return /^(file:|content:|https?:|assets-library:|ph:|data:)/.test(path);
}

/** Runder Hunde-Avatar; zeigt Platzhalter-Icon, wenn kein Foto vorhanden. */
export function DogAvatar({ avatarPath, size = 56 }: Props) {
  const { colors } = useTheme();
  const uri = avatarPath
    ? isDirectUri(avatarPath)
      ? avatarPath
      : publicUrl('dog-avatars', avatarPath)
    : null;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="cover" />
      ) : (
        <DogIcon size={size * 0.5} color={colors.accent} />
      )}
    </View>
  );
}
