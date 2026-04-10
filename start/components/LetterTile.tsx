import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface LetterTileProps {
  letter: string;
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function LetterTile({
  letter,
  isSelected = false,
  onPress,
  disabled = false,
}: LetterTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.tile,
          isSelected && styles.tileSelected,
          disabled && styles.tileDisabled,
        ]}
      >
        <Text style={[styles.letter, isSelected && styles.letterSelected]}>
          {letter.toUpperCase()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#93c5fd",
  },
  tileSelected: {
    backgroundColor: "#ef4444",
    borderColor: "#dc2626",
  },
  tileDisabled: {
    opacity: 0.5,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
  },
  letterSelected: {
    color: "#fff",
  },
});
