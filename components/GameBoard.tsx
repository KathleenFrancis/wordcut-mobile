import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface GameBoardProps {
  currentWord: string;
  onSubmitWord: (newWord: string, removedCount: number) => void;
  canSubmit: boolean;
}

interface LetterItem {
  id: string;
  letter: string;
}

export function GameBoard({ currentWord, onSubmitWord, canSubmit }: GameBoardProps) {
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [arrangedLetters, setArrangedLetters] = useState<LetterItem[]>([]);

  // Initialiser les lettres quand le mot change
  useEffect(() => {
    const letters = currentWord.split('').map((letter, index) => ({
      id: `${letter}-${index}`,
      letter,
    }));
    setArrangedLetters(letters);
    setSelectedIndices([]);
    setError('');
  }, [currentWord]);

  // Toggle sélection d'une lettre
  const toggleLetterSelection = (index: number) => {
    setError('');

    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      if (selectedIndices.length >= 3) {
        setError(t.game.mustRemove);
        return;
      }
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  // Mélanger les lettres
  const shuffleLetters = () => {
    const shuffled = [...arrangedLetters].sort(() => Math.random() - 0.5);
    setArrangedLetters(shuffled);
  };

  // Annuler la sélection
  const undoSelection = () => {
    setSelectedIndices([]);
    setError('');
  };

  // Valider le nouveau mot
  const handleValidate = () => {
    if (selectedIndices.length === 0 || selectedIndices.length > 3) {
      setError(t.game.mustRemove);
      return;
    }

    // Créer le nouveau mot sans les lettres sélectionnées
    const newWord = arrangedLetters
      .filter((_, index) => !selectedIndices.includes(index))
      .map(item => item.letter)
      .join('');

    onSubmitWord(newWord, selectedIndices.length);
  };

  return (
    <View style={styles.container}>
      {/* Mot actuel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.game.currentWord}</Text>
        <View style={styles.currentWordContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lettersContainer}>
            {arrangedLetters.map((item, index) => {
              const isSelected = selectedIndices.includes(index);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleLetterSelection(index)}
                  style={[
                    styles.letterTile,
                    isSelected && styles.letterTileSelected,
                  ]}
                >
                  <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>
                    {item.letter.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <Text style={styles.hint}>{t.game.selectLetters}</Text>
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={Sizes.icon.sm} color={Colors.red[600]} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Boutons d'action */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={undoSelection}
          disabled={selectedIndices.length === 0}
        >
          <Ionicons name="arrow-undo" size={Sizes.icon.sm} color={Colors.gray[600]} />
          <Text style={styles.secondaryButtonText}>{t.game.undo}</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={shuffleLetters}
        >
          <Ionicons name="shuffle" size={Sizes.icon.sm} color={Colors.gray[600]} />
          <Text style={styles.secondaryButtonText}>{t.game.shuffle}</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.primaryButton, !canSubmit && styles.disabledButton]}
          onPress={handleValidate}
          disabled={!canSubmit || selectedIndices.length === 0}
        >
          <Ionicons name="checkmark" size={Sizes.icon.sm} color={Colors.white} />
          <Text style={styles.primaryButtonText}>{t.game.validate}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    ...Sizes.shadow.medium,
  },
  section: {
    marginBottom: Sizes.spacing.lg,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Sizes.spacing.md,
  },
  currentWordContainer: {
    minHeight: 80,
    justifyContent: 'center',
  },
  lettersContainer: {
    gap: Sizes.spacing.sm,
    paddingVertical: Sizes.spacing.sm,
  },
  letterTile: {
    width: Sizes.letterTile.size,
    height: Sizes.letterTile.size,
    borderRadius: Sizes.borderRadius.lg,
    backgroundColor: Colors.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue[300],
  },
  letterTileSelected: {
    backgroundColor: Colors.red[500],
    borderColor: Colors.red[600],
  },
  letterText: {
    fontSize: Sizes.letterTile.fontSize,
    fontWeight: 'bold',
    color: Colors.blue[700],
  },
  letterTextSelected: {
    color: Colors.white,
  },
  hint: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.gray[500],
    textAlign: 'center',
    marginTop: Sizes.spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    backgroundColor: Colors.red[50],
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    marginBottom: Sizes.spacing.md,
  },
  errorText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.red[700],
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.xs,
    paddingVertical: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary.green,
    ...Sizes.shadow.small,
  },
  primaryButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.gray[100],
  },
  secondaryButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  disabledButton: {
    opacity: 0.5,
  },
});
