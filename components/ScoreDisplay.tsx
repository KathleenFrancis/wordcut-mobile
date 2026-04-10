import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <Animated.View 
      entering={ZoomIn.springify()}
      key={score}
      style={styles.container}
    >
      <Ionicons name="trophy" size={Sizes.icon.sm} color={Colors.white} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{t.game.score}</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.full,
    ...Sizes.shadow.large,
  },
  textContainer: {
    flexDirection: 'column',
  },
  label: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.white,
    opacity: 0.9,
  },
  score: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
