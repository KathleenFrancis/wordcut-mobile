import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export function Timer({ initialTime, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  const width = useSharedValue(100);

  useEffect(() => {
    setTimeLeft(initialTime);
    width.value = 100;
  }, [initialTime, width]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        const newTime = prev - 1;
        width.value = withTiming((newTime / initialTime) * 100, { duration: 300 });
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, initialTime, width]);

  const isLowTime = timeLeft <= 20;
  const isCritical = timeLeft <= 10;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const iconColor = isCritical ? Colors.red[600] : isLowTime ? Colors.orange[600] : Colors.blue[500];
  const textColor = isCritical ? Colors.red[600] : isLowTime ? Colors.orange[600] : Colors.gray[900];
  const barColor = isCritical ? Colors.red[600] : isLowTime ? Colors.orange[600] : Colors.blue[500];

  return (
    <View style={[styles.container, isCritical && styles.containerCritical]}>
      <View style={styles.content}>
        <Ionicons name="timer-outline" size={Sizes.icon.sm} color={iconColor} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t.game.timeRemaining}</Text>
          <Text style={[styles.time, { color: textColor }]}>{timeDisplay}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            animatedStyle,
            { backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.full,
    ...Sizes.shadow.large,
  },
  containerCritical: {
    // Peut ajouter une animation pulse ici si nécessaire
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  textContainer: {
    flexDirection: 'column',
  },
  label: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.gray[600],
  },
  time: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: Sizes.spacing.sm,
    height: 6,
    backgroundColor: Colors.gray[200],
    borderRadius: Sizes.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Sizes.borderRadius.full,
  },
});
