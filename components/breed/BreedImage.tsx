import { View, type DimensionValue } from 'react-native';
import { Image } from 'expo-image';
import { PawPrint } from 'lucide-react-native';
import { publicUrl } from '@/lib/supabase';
import { radius, useTheme } from '@/theme';

type Props = {
  breedId: string;
  height?: number;
  width?: DimensionValue;
  rounded?: number;
};

/**
 * Rassenbild aus dem Storage-Bucket (remote, mit Geräte-Cache).
 * Fehlt das Bild, bleibt der Platzhalter sichtbar — die App funktioniert offline.
 */
export function BreedImage({ breedId, height = 160, width = '100%', rounded }: Props) {
  const { colors } = useTheme();
  const uri = publicUrl('breed-images', `${breedId}.jpg`);

  return (
    <View
      style={{
        width,
        height,
        borderRadius: rounded ?? radius.md,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <PawPrint size={height * 0.28} color={colors.accent} />
      <Image
        source={{ uri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
        cachePolicy="disk"
      />
    </View>
  );
}
