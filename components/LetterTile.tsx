import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';

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
  disabled = false 
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
    width: Sizes.letterTile.size,
    height: Sizes.letterTile.size,
    borderRadius: Sizes.borderRadius.lg,
    backgroundColor: Colors.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue[300],
  },
  tileSelected: {
    backgroundColor: Colors.red[500],
    borderColor: Colors.red[600],
  },
  tileDisabled: {
    opacity: 0.5,
  },
  letter: {
    fontSize: Sizes.letterTile.fontSize,
    fontWeight: 'bold',
    color: Colors.blue[700],
  },
  letterSelected: {
    color: Colors.white,
  },
});
