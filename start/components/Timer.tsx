import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../utils/locales";

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
  }, [initialTime]);

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
        width.value = withTiming((newTime / initialTime) * 100, {
          duration: 300,
        });
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;
  const isLowTime = timeLeft <= 20;
  const isCritical = timeLeft <= 10;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const iconColor = isCritical ? "#dc2626" : isLowTime ? "#ea580c" : "#3b82f6";
  const textColor = isCritical ? "#dc2626" : isLowTime ? "#ea580c" : "#111827";

  return (
    <View style={[styles.container, isCritical && styles.containerCritical]}>
      <View style={styles.content}>
        <Ionicons name="timer-outline" size={20} color={iconColor} />
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
            {
              backgroundColor: isCritical
                ? "#dc2626"
                : isLowTime
                  ? "#ea580c"
                  : "#3b82f6",
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  containerCritical: {
    // Animation pulse pourrait être ajoutée ici
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textContainer: {
    flexDirection: "column",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBar: {
    marginTop: 8,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
  },
});
