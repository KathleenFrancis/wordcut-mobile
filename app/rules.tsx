import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

export default function Rules() {
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <LinearGradient colors={Colors.gradients.primary} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={Sizes.icon.md} color={Colors.gray[700]} />
          <Text style={styles.backText}>{t.rules.backToHome}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Titre */}
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <Text style={styles.title}>{t.rules.title}</Text>
        </Animated.View>

        {/* Objectif */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.sectionTitle}>{t.rules.objective}</Text>
          </View>
          <Text style={styles.text}>{t.rules.objectiveText}</Text>
        </Animated.View>

        {/* Comment jouer */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.emoji}>🎮</Text>
            <Text style={styles.sectionTitle}>{t.rules.howToPlay}</Text>
          </View>
          <View style={styles.steps}>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={Sizes.icon.sm} color={Colors.green[500]} />
              <Text style={styles.stepText}>{t.rules.step1}</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={Sizes.icon.sm} color={Colors.green[500]} />
              <Text style={styles.stepText}>{t.rules.step2}</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={Sizes.icon.sm} color={Colors.green[500]} />
              <Text style={styles.stepText}>{t.rules.step3}</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={Sizes.icon.sm} color={Colors.green[500]} />
              <Text style={styles.stepText}>{t.rules.step4}</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={Sizes.icon.sm} color={Colors.green[500]} />
              <Text style={styles.stepText}>{t.rules.step5}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Système de points */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.emoji}>⭐</Text>
            <Text style={styles.sectionTitle}>{t.rules.scoring}</Text>
          </View>
          <Text style={styles.text}>{t.rules.scoringIntro}</Text>

          <View style={styles.scoringBox}>
            {/* Points de base */}
            <View style={styles.scoringSection}>
              <Text style={styles.scoringSubtitle}>{t.rules.basePoints}</Text>
              <View style={styles.scoringItem}>
                <View style={[styles.badge, { backgroundColor: Colors.green[500] }]}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
                <Text style={styles.scoringText}>{t.rules.basePoints1}</Text>
              </View>
              <View style={styles.scoringItem}>
                <View style={[styles.badge, { backgroundColor: Colors.blue[500] }]}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
                <Text style={styles.scoringText}>{t.rules.basePoints2}</Text>
              </View>
              <View style={styles.scoringItem}>
                <View style={[styles.badge, { backgroundColor: Colors.purple[500] }]}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
                <Text style={styles.scoringText}>{t.rules.basePoints3}</Text>
              </View>
            </View>

            {/* Bonus */}
            <View style={styles.divider} />
            <View style={styles.scoringSection}>
              <Text style={styles.scoringSubtitle}>{t.rules.reorderBonus}</Text>
              <View style={styles.scoringItem}>
                <View style={[styles.badge, { backgroundColor: Colors.orange[500] }]}>
                  <Text style={styles.badgeText}>+2</Text>
                </View>
                <Text style={styles.scoringText}>{t.rules.reorderBonusText}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Contraintes */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.emoji}>⏱️</Text>
            <Text style={styles.sectionTitle}>{t.rules.constraints}</Text>
          </View>
          <View style={styles.constraints}>
            <View style={styles.constraint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.constraintText}>{t.rules.constraint1}</Text>
            </View>
            <View style={styles.constraint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.constraintText}>{t.rules.constraint2}</Text>
            </View>
            <View style={styles.constraint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.constraintText}>{t.rules.constraint3}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bouton Jouer */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.playButtonContainer}
        >
          <Pressable
            style={styles.playButton}
            onPress={() => router.push('/game')}
          >
            <Ionicons name="play" size={Sizes.icon.md} color={Colors.white} />
            <Text style={styles.playButtonText}>
              {language === 'fr' ? 'Commencer à jouer' : 'Start playing'}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.xxl,
    paddingBottom: Sizes.spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
  },
  backText: {
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary.blue,
    marginBottom: Sizes.spacing.xl,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.lg,
    ...Sizes.shadow.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.md,
  },
  emoji: {
    fontSize: Sizes.fontSize.xxl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  text: {
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
    lineHeight: 24,
  },
  steps: {
    gap: Sizes.spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizes.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  scoringBox: {
    backgroundColor: Colors.blue[50],
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.lg,
    marginTop: Sizes.spacing.md,
  },
  scoringSection: {
    gap: Sizes.spacing.sm,
  },
  scoringSubtitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: Sizes.spacing.xs,
  },
  scoringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: 'bold',
    color: Colors.white,
  },
  scoringText: {
    flex: 1,
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.purple[200],
    marginVertical: Sizes.spacing.md,
  },
  constraints: {
    gap: Sizes.spacing.sm,
  },
  constraint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizes.spacing.sm,
  },
  bullet: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.blue[500],
    fontWeight: 'bold',
  },
  constraintText: {
    flex: 1,
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  playButtonContainer: {
    marginVertical: Sizes.spacing.xl,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.md,
    backgroundColor: Colors.primary.green,
    paddingVertical: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.xl,
    ...Sizes.shadow.large,
  },
  playButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.white,
  },
});
