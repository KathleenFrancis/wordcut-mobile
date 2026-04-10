import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WordEntry } from '../types/game';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface WordHistoryProps {
  history: WordEntry[];
}

export function WordHistory({ history }: WordHistoryProps) {
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  if (history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.game.history}</Text>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {history.map((entry, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 50).springify()}
            style={styles.entry}
          >
            <View style={styles.entryHeader}>
              <Text style={styles.word}>{entry.word.toUpperCase()}</Text>
              <Text style={styles.points}>+{entry.totalPoints}</Text>
            </View>
            
            <View style={styles.entryDetails}>
              <Text style={styles.detail}>
                {entry.removedCount} {entry.removedCount === 1 ? t.game.letter : t.game.letters}{' '}
                {entry.removedCount === 1 ? t.game.removed : t.game.removedPlural}
              </Text>
              
              {entry.reorderBonus > 0 && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>
                    +{entry.reorderBonus} {t.game.reorderBonus}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.md,
    ...Sizes.shadow.medium,
  },
  title: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: Sizes.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  entry: {
    backgroundColor: Colors.blue[50],
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.md,
    marginBottom: Sizes.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue[500],
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.xs,
  },
  word: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.blue[700],
  },
  points: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.green[600],
  },
  entryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  detail: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.gray[600],
  },
  bonusBadge: {
    backgroundColor: Colors.orange[100],
    paddingHorizontal: Sizes.spacing.sm,
    paddingVertical: 2,
    borderRadius: Sizes.borderRadius.md,
  },
  bonusText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.orange[700],
    fontWeight: '600',
  },
});
