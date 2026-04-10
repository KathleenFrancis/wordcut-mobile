// Types pour le jeu WordCut

export interface WordEntry {
  word: string;
  basePoints: number;
  reorderBonus: number;
  totalPoints: number;
  removedCount: number;
}

export interface GameState {
  currentWord: string;
  history: WordEntry[];
  totalScore: number;
  isGameWon: boolean;
}
