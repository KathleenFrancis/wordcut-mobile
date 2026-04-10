// Dimensions et espacements standardisés
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Sizes = {
  // Dimensions de l'écran
  window: {
    width,
    height,
  },

  // Espacements
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Tailles de police
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
    massive: 64,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Tailles de bouton
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 56,
    },
    padding: {
      horizontal: 24,
      vertical: 12,
    },
  },

  // Tailles d'icône
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Letter tile
  letterTile: {
    size: 56,
    fontSize: 24,
  },

  // Ombres
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
