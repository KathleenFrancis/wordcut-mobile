import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { GameBoard } from '../components/GameBoard';
import { WordHistory } from '../components/WordHistory';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { WinDialog } from '../components/WinDialog';
import { Timer } from '../components/Timer';
import { GameState } from '../types/game';
import {
  getRandomStartWord,
  isValidWord,
  calculatePoints,
  initializeDictionary,
} from '../utils/dictionary';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

export default function Game() {
  const { getEffectiveUILanguage, dictionaryLanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  const [gameState, setGameState] = useState<GameState>({
    currentWord: '',
    history: [],
    totalScore: 0,
    isGameWon: false,
  });
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const startNewGame = useCallback(() => {
    try {
      const startWord = getRandomStartWord();
      setGameState({
        currentWord: startWord,
        history: [],
        totalScore: 0,
        isGameWon: false,
      });
      setShowWinDialog(false);
      setIsGameOver(false);
      setIsTimerRunning(true);
      setTimerKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error starting new game:', error);
      Alert.alert(
        language === 'fr' ? 'Erreur' : 'Error',
        language === 'fr'
          ? 'Impossible de démarrer une partie'
          : 'Unable to start a game'
      );
    }
  }, [language]);

  const initializeGame = useCallback(async () => {
    setIsInitializing(true);
    try {
      await initializeDictionary(dictionaryLanguage);
      startNewGame();
    } catch (error) {
      console.error('Error initializing game:', error);
      Alert.alert(
        language === 'fr' ? 'Erreur' : 'Error',
        language === 'fr'
          ? 'Erreur lors du chargement du dictionnaire'
          : 'Error loading dictionary'
      );
    } finally {
      setIsInitializing(false);
    }
  }, [dictionaryLanguage, language, startNewGame]);

  // Initialiser le dictionnaire et le jeu
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleSubmitWord = (newWord: string, removedCount: number) => {
    // Vérifier si le jeu est terminé
    if (isGameOver || gameState.isGameWon) {
      return;
    }

    // Vérifier si c'est un mot valide
    if (!isValidWord(newWord)) {
      Alert.alert(
        language === 'fr' ? 'Mot invalide' : 'Invalid word',
        `"${newWord.toUpperCase()}" ${t.game.invalidWord}`
      );
      return;
    }

    // Calculer les points
    const points = calculatePoints(gameState.currentWord, newWord, removedCount);

    // Ajouter à l'historique
    const newEntry = {
      word: newWord,
      basePoints: points.basePoints,
      reorderBonus: points.reorderBonus,
      totalPoints: points.total,
      removedCount,
    };

    // Vérifier si le jeu est gagné (mot de 1, 2 ou 3 lettres)
    const isWon = newWord.length <= 3;

    const newGameState = {
      currentWord: newWord,
      history: [...gameState.history, newEntry],
      totalScore: gameState.totalScore + points.total,
      isGameWon: isWon,
    };

    setGameState(newGameState);

    if (isWon) {
      setIsTimerRunning(false);
      setTimeout(() => {
        setShowWinDialog(true);
      }, 500);
    }
  };

  const handleTimeUp = () => {
    if (!gameState.isGameWon) {
      setIsGameOver(true);
      setIsTimerRunning(false);
      Alert.alert(
        t.game.gameOver,
        `${t.game.finalScore}: ${gameState.totalScore}`,
        [
          {
            text: t.game.playAgain,
            onPress: startNewGame,
          },
          {
            text: t.game.backToHome,
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handleRestart = () => {
    Alert.alert(
      language === 'fr' ? 'Recommencer' : 'Restart',
      language === 'fr'
        ? 'Êtes-vous sûr de vouloir recommencer ?'
        : 'Are you sure you want to restart?',
      [
        {
          text: language === 'fr' ? 'Annuler' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'fr' ? 'Recommencer' : 'Restart',
          onPress: startNewGame,
        },
      ]
    );
  };

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {language === 'fr' ? 'Chargement...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <LinearGradient colors={Colors.gradients.primary} style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={Sizes.icon.md} color={Colors.gray[700]} />
            <Text style={styles.backText}>{t.game.backToHome}</Text>
          </Pressable>

          <View style={styles.headerRight}>
            <Timer
              key={timerKey}
              initialTime={90}
              onTimeUp={handleTimeUp}
              isRunning={isTimerRunning}
            />
            <ScoreDisplay score={gameState.totalScore} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* GameBoard */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <GameBoard
              currentWord={gameState.currentWord}
              onSubmitWord={handleSubmitWord}
              canSubmit={!isGameOver && !gameState.isGameWon}
            />
          </Animated.View>

          {/* Historique */}
          {gameState.history.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={styles.historyContainer}
            >
              <WordHistory history={gameState.history} />
            </Animated.View>
          )}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleRestart}>
            <Ionicons name="reload" size={Sizes.icon.sm} color={Colors.white} />
            <Text style={styles.actionButtonText}>{t.game.restart}</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={startNewGame}>
            <Ionicons name="play-skip-forward" size={Sizes.icon.sm} color={Colors.white} />
            <Text style={styles.actionButtonText}>{t.game.newGame}</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <WinDialog
        show={showWinDialog}
        score={gameState.totalScore}
        onNewGame={startNewGame}
        onClose={() => router.back()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue[50],
  },
  loadingText: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.gray[600],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerRight: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    alignItems: 'center',
    flexShrink: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.spacing.lg,
  },
  historyContainer: {
    marginTop: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.sm,
    backgroundColor: Colors.primary.blue,
    paddingVertical: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    ...Sizes.shadow.small,
  },
  actionButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
