# Structure du Projet React Native - WordCut Mobile

Cette documentation présente la structure complète du projet React Native avec Expo SDK 54.

---

## 📁 Structure des fichiers

```
wordcut-mobile/
│
├── app/                                    # Expo Router (file-based routing)
│   ├── _layout.tsx                        # Layout racine avec providers
│   ├── index.tsx                          # Page d'accueil (/)
│   ├── game.tsx                           # Page du jeu (/game)
│   ├── rules.tsx                          # Page des règles (/rules)
│   └── +not-found.tsx                     # Page 404
│
├── components/                            # Composants réutilisables
│   ├── GameBoard.tsx                      # Plateau de jeu avec drag & drop
│   ├── LanguagePanel.tsx                  # Panel de sélection de langue
│   ├── LetterTile.tsx                     # Tuile de lettre interactive
│   ├── ScoreDisplay.tsx                   # Affichage du score
│   ├── SettingsPanel.tsx                  # Panel de paramètres audio
│   ├── Timer.tsx                          # Minuteur avec progression
│   ├── WinDialog.tsx                      # Dialogue de victoire
│   └── WordHistory.tsx                    # Historique des coups
│
├── contexts/                              # Contextes React
│   ├── AudioContext.tsx                   # Gestion audio (musique, SFX)
│   └── LanguageContext.tsx                # Gestion langue UI + dictionnaire
│
├── utils/                                 # Utilitaires et logique métier
│   ├── dictionary.ts                      # Gestion des dictionnaires de mots
│   ├── storage.ts                         # Wrapper AsyncStorage/SecureStore
│   └── locales/                           # Traductions
│       ├── fr.ts                          # Traductions françaises
│       ├── en.ts                          # Traductions anglaises
│       └── index.ts                       # Export centralisé
│
├── types/                                 # Types TypeScript
│   └── game.ts                            # Types pour l'état du jeu
│
├── assets/                                # Ressources statiques
│   ├── dictionaries/                      # Fichiers de dictionnaires
│   │   ├── fr_dict.txt                    # Dictionnaire français (336k mots)
│   │   └── en_dict.txt                    # Dictionnaire anglais (370k mots)
│   ├── fonts/                             # Polices personnalisées
│   ├── icon.png                           # Icône de l'app (1024x1024)
│   ├── splash.png                         # Splash screen
│   ├── adaptive-icon.png                  # Icône adaptative Android
│   └── favicon.png                        # Favicon web
│
├── constants/                             # Constantes globales
│   ├── Colors.ts                          # Palette de couleurs
│   └── Sizes.ts                           # Dimensions et espacements
│
├── hooks/                                 # Hooks personnalisés
│   ├── useGameLogic.ts                    # Logique principale du jeu
│   └── useDictionary.ts                   # Gestion du dictionnaire
│
├── app.json                               # Configuration Expo
├── package.json                           # Dépendances npm
├── tsconfig.json                          # Configuration TypeScript
├── babel.config.js                        # Configuration Babel
└── metro.config.js                        # Configuration Metro bundler
```

---

## 🔧 Fichiers de configuration

### app.json

```json
{
  "expo": {
    "name": "WordCut",
    "slug": "wordcut",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "wordcut",
    "platforms": ["ios", "android"],
    
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#dbeafe"
    },
    
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.wordcut",
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    },
    
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#dbeafe"
      },
      "package": "com.yourcompany.wordcut",
      "permissions": []
    },
    
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true
          }
        }
      ]
    ],
    
    "extra": {
      "router": {
        "origin": false
      }
    }
  }
}
```

### package.json

```json
{
  "name": "wordcut-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "expo": "^54.0.0",
    "expo-asset": "~11.0.0",
    "expo-constants": "~17.0.0",
    "expo-font": "~13.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-linking": "~7.0.0",
    "expo-localization": "~16.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-draggable-flatlist": "^4.0.1",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-modal": "^13.0.1",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "typescript": "^5.3.3"
  }
}
```

### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Doit être en dernier
    ],
  };
};
```

### metro.config.js

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter .txt pour charger les dictionnaires
config.resolver.assetExts.push('txt');

module.exports = config;
```

---

## 📱 Pages principales

### 1. Layout racine (app/_layout.tsx)

```typescript
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AudioProvider } from '../contexts/AudioContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Charger polices personnalisées si nécessaire
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AudioProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="game" />
            <Stack.Screen name="rules" />
          </Stack>
        </AudioProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
```

### 2. Page d'accueil (app/index.tsx)

- Affiche le titre et logo de l'application
- Menu avec boutons : Jouer, Règles, Langue, Paramètres
- Animations d'entrée avec Reanimated
- Gradients de couleur
- Ouvre les modales pour langue et paramètres

### 3. Page du jeu (app/game.tsx)

- Plateau de jeu avec lettres draggables
- Timer avec barre de progression
- Affichage du score en temps réel
- Historique des coups
- Boutons : Nouvelle partie, Recommencer, Retour
- Dialogue de victoire
- Gestion de la logique du jeu

### 4. Page des règles (app/rules.tsx)

- Explication de l'objectif
- Instructions pas à pas
- Système de points détaillé
- Contraintes de temps
- Bouton pour commencer à jouer

---

## 🎨 Composants clés

### GameBoard

- Affiche le mot actuel avec tuiles interactives
- Sélection de 1 à 3 lettres à retirer
- Zone de drag & drop pour réorganiser les lettres
- Validation du nouveau mot
- Messages d'erreur

**Technologies** :
- `react-native-draggable-flatlist` pour le drag & drop
- `react-native-reanimated` pour les animations
- Validation en temps réel avec dictionary.ts

### LetterTile

- Tuile représentant une lettre
- États : normal, sélectionné, désactivé
- Animations au toucher (scale)
- Style personnalisable

### Timer

- Compte à rebours de 90 secondes
- Barre de progression animée
- Changement de couleur (bleu → orange → rouge)
- Animation pulse en mode critique

### LanguagePanel

- Modal latéral (slide from right)
- Sélection langue UI : Système / Français / Anglais
- Sélection dictionnaire : FR / EN / Personnalisé
- Ajout de dictionnaires via URL ou fichier
- Gestion des dictionnaires personnalisés

### SettingsPanel

- Modal latéral
- Sliders pour volume musique et SFX
- Sauvegarde automatique dans AsyncStorage

---

## 🔄 Flux de données

```
User Action (Pressable, TextInput, etc.)
    ↓
Component Event Handler
    ↓
Context Update (useLanguage, useAudio)
    ↓
AsyncStorage Persistence
    ↓
Re-render Components
    ↓
Visual Feedback (Animations)
```

---

## 💾 Gestion du stockage

### AsyncStorage (données générales)

```typescript
// Clés utilisées :
- wordcut-ui-language              // 'fr' | 'en' | 'system'
- wordcut-dictionary-language      // 'fr' | 'en' | 'custom-xxx'
- wordcut-custom-dictionaries      // JSON array
- wordcut-music-volume             // 0-100
- wordcut-sfx-volume               // 0-100
```

### SecureStore (optionnel pour données sensibles)

Dans ce projet, SecureStore n'est pas strictement nécessaire car aucune donnée sensible n'est stockée. Cependant, il est disponible pour de futures fonctionnalités (authentification, etc.).

---

## 🎮 Logique du jeu

### Initialisation

1. Charger les préférences (langue, volume)
2. Charger le dictionnaire sélectionné
3. Générer un mot de départ aléatoire (≥ 5 lettres)
4. Démarrer le timer à 90 secondes

### Tour de jeu

1. Joueur sélectionne 1-3 lettres à retirer
2. Joueur réorganise les lettres restantes (optionnel)
3. Validation du nouveau mot dans le dictionnaire
4. Calcul des points :
   - Base : 3pts (1 lettre) / 2pts (2 lettres) / 1pt (3 lettres)
   - Bonus : +2pts si réorganisation
5. Ajout à l'historique
6. Le nouveau mot devient le mot actuel
7. Continuer jusqu'à mot de 1-3 lettres OU temps écoulé

### Fin de partie

**Victoire** (mot de 1-3 lettres) :
- Arrêter le timer
- Afficher dialogue de victoire avec score
- Option : Nouvelle partie

**Défaite** (temps écoulé) :
- Afficher message de fin
- Afficher score final
- Option : Nouvelle partie

---

## 🚀 Commandes de développement

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npx expo start

# Lancer sur iOS Simulator
npx expo start --ios

# Lancer sur Android Emulator
npx expo start --android

# Lancer en mode web (pour testing)
npx expo start --web

# Vérifier le type-checking
npm run type-check

# Linter le code
npm run lint

# Build de production avec EAS
eas build --platform android
eas build --platform ios
```

---

## 📦 Build et déploiement

### Configuration EAS (Expo Application Services)

**eas.json** :

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Commandes de build

```bash
# Build pour développement
eas build --profile development --platform android

# Build pour preview (APK)
eas build --profile preview --platform android

# Build pour production
eas build --profile production --platform all

# Submit vers les stores
eas submit --platform android
eas submit --platform ios
```

---

## 🧪 Tests

Structure recommandée pour les tests :

```
__tests__/
├── utils/
│   ├── dictionary.test.ts
│   └── storage.test.ts
├── contexts/
│   ├── LanguageContext.test.tsx
│   └── AudioContext.test.tsx
└── components/
    ├── GameBoard.test.tsx
    ├── LetterTile.test.tsx
    └── Timer.test.tsx
```

---

## 📝 Notes importantes

### Performance

- Utiliser `React.memo()` pour composants qui re-render souvent
- Utiliser `useMemo()` pour calculs coûteux (tri de dictionnaire)
- Utiliser `useCallback()` pour handlers d'événements
- Lazy load des dictionnaires (ne charger que quand nécessaire)

### Accessibilité

- Ajouter `accessibilityLabel` à tous les Pressables
- Utiliser `accessibilityHint` pour expliquer les actions
- Tester avec VoiceOver (iOS) et TalkBack (Android)

### Internationalisation

- Toutes les strings UI doivent être dans locales/
- Support de la détection automatique de langue
- Format des nombres selon locale (ex: 1,234 vs 1.234)

### Offline First

- L'application fonctionne entièrement hors ligne
- Dictionnaires chargés localement
- Pas de dépendance réseau (sauf ajout de dictionnaire via URL)

---

## 🔗 Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

Cette structure est optimisée pour :
- ✅ Scalabilité
- ✅ Maintenabilité
- ✅ Performance
- ✅ Expérience utilisateur
- ✅ Cross-platform (iOS/Android)
