import { View, type DimensionValue } from 'react-native';
import { Image } from 'expo-image';
import { PawPrint } from 'lucide-react-native';
import breedImages from '@/data/breedImages.json';
import { radius, useTheme } from '@/theme';

const images = breedImages as Record<string, string>;

type Props = {
  breedId: string;
  height?: number;
  width?: DimensionValue;
  rounded?: number;
};

/**
 * Rassenbild aus der gebündelten Bildliste (Wikimedia, frei lizenziert).
 * Fehlt ein Bild, bleibt der Platzhalter sichtbar — die App funktioniert offline.
 */
export function BreedImage({ breedId, height = 160, width = '100%', rounded }: Props) {
  const { colors } = useTheme();
  const uri = images[breedId];

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
      {uri ? (
        <Image
          source={{ uri }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
        />
      ) : null}
    </View>
  );
}
