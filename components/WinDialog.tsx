import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface WinDialogProps {
  show: boolean;
  score: number;
  onNewGame: () => void;
  onClose: () => void;
}

export function WinDialog({ show, score, onNewGame, onClose }: WinDialogProps) {
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  if (!show) return null;

  return (
    <Modal
      transparent
      visible={show}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={ZoomIn.springify().delay(100)}
          style={styles.dialog}
        >
          {/* Icône de victoire */}
          <Animated.View entering={ZoomIn.springify().delay(300)}>
            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={64} color={Colors.primary.green} />
            </View>
          </Animated.View>

          {/* Titre */}
          <Animated.View entering={FadeIn.delay(400)}>
            <Text style={styles.title}>{t.game.youWin}</Text>
          </Animated.View>

          {/* Score */}
          <Animated.View entering={FadeIn.delay(500)}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>{t.game.finalScore}</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          </Animated.View>

          {/* Boutons */}
          <Animated.View 
            entering={FadeIn.delay(600)}
            style={styles.buttonsContainer}
          >
            <Pressable
              style={styles.primaryButton}
              onPress={onNewGame}
            >
              <Ionicons name="play" size={Sizes.icon.sm} color={Colors.white} />
              <Text style={styles.primaryButtonText}>{t.game.playAgain}</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>{t.game.backToHome}</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xxl,
    padding: Sizes.spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...Sizes.shadow.large,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.green[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: Sizes.spacing.md,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: Colors.blue[50],
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[600],
    marginBottom: Sizes.spacing.xs,
  },
  scoreValue: {
    fontSize: Sizes.fontSize.huge,
    fontWeight: 'bold',
    color: Colors.blue[600],
  },
  buttonsContainer: {
    width: '100%',
    gap: Sizes.spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.sm,
    ...Sizes.shadow.medium,
  },
  primaryButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.gray[600],
  },
});
