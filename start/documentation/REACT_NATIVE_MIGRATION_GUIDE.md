# Guide de Migration React Native / Expo SDK 54

Ce document explique comment migrer l'application WordCut de React Web vers React Native avec Expo SDK 54.

## 📋 Table des matières

1. [Configuration du projet](#1-configuration-du-projet)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Migration du stockage](#3-migration-du-stockage)
4. [Migration du routing](#4-migration-du-routing)
5. [Migration des composants](#5-migration-des-composants)
6. [Migration des animations](#6-migration-des-animations)
7. [Dépendances nécessaires](#7-dépendances-nécessaires)

---

## 1. Configuration du projet

### Créer un nouveau projet Expo

```bash
npx create-expo-app@latest wordcut-mobile --template blank-typescript
cd wordcut-mobile
```

### Installer Expo SDK 54

```bash
npx expo install expo@^54.0.0
```

### Installer les dépendances principales

```bash
# Routing
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Stockage
npx expo install expo-secure-store @react-native-async-storage/async-storage

# Animations
npx expo install react-native-reanimated react-native-gesture-handler

# Drag and drop
npm install react-native-draggable-flatlist

# Icons
npm install @expo/vector-icons

# Utilitaires
npm install clsx tailwind-merge
```

---

## 2. Structure des dossiers

Structure Expo Router (fichier-based routing) :

```
wordcut-mobile/
├── app/
│   ├── _layout.tsx           # Layout racine avec providers
│   ├── index.tsx              # Page d'accueil (Home)
│   ├── game.tsx               # Page du jeu
│   ├── rules.tsx              # Page des règles
│   └── +not-found.tsx         # Page 404
├── components/
│   ├── GameBoard.tsx
│   ├── LanguagePanel.tsx
│   ├── LetterTile.tsx
│   ├── ScoreDisplay.tsx
│   ├── SettingsPanel.tsx
│   ├── Timer.tsx
│   ├── WinDialog.tsx
│   └── WordHistory.tsx
├── contexts/
│   ├── AudioContext.tsx
│   └── LanguageContext.tsx
├── utils/
│   ├── dictionary.ts
│   ├── storage.ts             # Wrapper pour SecureStore/AsyncStorage
│   └── locales/
│       ├── en.ts
│       ├── fr.ts
│       └── index.ts
├── assets/
│   ├── dictionaries/
│   │   ├── fr_dict.txt
│   │   └── en_dict.txt
│   └── fonts/
├── types/
│   └── game.ts
└── package.json
```

---

## 3. Migration du stockage

### Créer un wrapper pour le stockage

**`utils/storage.ts`** :

```typescript
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pour données sensibles (optionnel dans ce cas)
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },
  
  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },
  
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// Pour données générales
export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
```

### Adapter LanguageContext.tsx

```typescript
import { storage } from '../utils/storage';

// Au lieu de :
// localStorage.setItem('wordcut-ui-language', uiLanguage);

// Utiliser :
await storage.setItem('wordcut-ui-language', uiLanguage);

// Au lieu de :
// const saved = localStorage.getItem('wordcut-ui-language');

// Utiliser :
const saved = await storage.getItem('wordcut-ui-language');
```

**Note** : Cela nécessite de rendre les fonctions asynchrones et d'utiliser `useEffect` avec un état de chargement.

---

## 4. Migration du routing

### Configuration Expo Router

**`app/_layout.tsx`** :

```typescript
import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AudioProvider } from '../contexts/AudioContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AudioProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="game" />
          <Stack.Screen name="rules" />
        </Stack>
      </AudioProvider>
    </LanguageProvider>
  );
}
```

### Migration des pages

**De React Router** :
```typescript
import { Link } from 'react-router';

<Link to="/game">
  <button>Jouer</button>
</Link>
```

**Vers Expo Router** :
```typescript
import { Link } from 'expo-router';

<Link href="/game" asChild>
  <Pressable>
    <Text>Jouer</Text>
  </Pressable>
</Link>
```

---

## 5. Migration des composants

### Remplacements principaux

| Web React | React Native |
|-----------|--------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<Pressable>` ou `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `className` | `style` (StyleSheet) |
| CSS | StyleSheet.create() |

### Exemple de conversion d'un composant

**Avant (Web)** :

```tsx
export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-3 bg-blue-500 px-6 py-3 rounded-full">
      <Trophy className="w-6 h-6" />
      <div className="flex flex-col">
        <span className="text-xs">Score</span>
        <span className="text-2xl font-bold">{score}</span>
      </div>
    </div>
  );
}
```

**Après (React Native)** :

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={24} color="#fff" />
      <View style={styles.textContainer}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  textContainer: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    color: '#fff',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
```

### NativeWind (Tailwind pour React Native)

Si vous voulez conserver une syntaxe proche de Tailwind :

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

**tailwind.config.js** :
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**babel.config.js** :
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

Ensuite utilisez `className` comme avant :
```tsx
<View className="flex-row items-center gap-3 bg-blue-500 px-6 py-3 rounded-full">
```

---

## 6. Migration des animations

### De Framer Motion vers Reanimated

**Avant (motion/react)** :

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Text>Hello</Text>
</motion.div>
```

**Après (react-native-reanimated)** :

```tsx
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { useEffect } from 'react';

const MyComponent = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text>Hello</Text>
    </Animated.View>
  );
};
```

---

## 7. Dépendances nécessaires

### package.json minimal pour React Native/Expo

```json
{
  "name": "wordcut-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^54.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-constants": "~17.0.0",
    "expo-linking": "~7.0.0",
    "@react-native-async-storage/async-storage": "~2.1.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "react-native-draggable-flatlist": "^4.0.1",
    "@expo/vector-icons": "^14.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  }
}
```

---

## 8. Chargement des dictionnaires

### Utiliser Asset Loading d'Expo

```typescript
import { Asset } from 'expo-asset';

// Charger le dictionnaire
export async function loadDictionaryAsset(language: 'fr' | 'en') {
  const asset = Asset.fromModule(
    language === 'fr' 
      ? require('../assets/dictionaries/fr_dict.txt')
      : require('../assets/dictionaries/en_dict.txt')
  );
  
  await asset.downloadAsync();
  
  const response = await fetch(asset.localUri!);
  const text = await response.text();
  
  return loadDictionaryFromFile(text);
}
```

---

## 9. Drag and Drop pour les lettres

### Utiliser react-native-draggable-flatlist

```tsx
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

<DraggableFlatList
  data={arrangedLetters}
  onDragEnd={({ data }) => setArrangedLetters(data)}
  keyExtractor={(item) => item.id}
  renderItem={({ item, drag, isActive }) => (
    <ScaleDecorator>
      <Pressable
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.letterTile,
          isActive && styles.letterTileActive,
        ]}
      >
        <Text style={styles.letterText}>{item.letter}</Text>
      </Pressable>
    </ScaleDecorator>
  )}
  horizontal
/>
```

---

## 10. Modal/Sheet (Panel latéral)

### Utiliser react-native-modal

```bash
npm install react-native-modal
```

```tsx
import Modal from 'react-native-modal';

<Modal
  isVisible={isLanguagePanelOpen}
  onBackdropPress={() => setIsLanguagePanelOpen(false)}
  animationIn="slideInRight"
  animationOut="slideOutRight"
  style={styles.modal}
>
  <View style={styles.modalContent}>
    {/* Contenu du panel */}
  </View>
</Modal>
```

---

## 11. Points d'attention

### ⚠️ Différences importantes

1. **Pas de CSS/Tailwind natif** : Utiliser StyleSheet ou NativeWind
2. **Pas de DOM** : Pas d'accès à document, window, localStorage
3. **Navigation différente** : File-based routing avec Expo Router
4. **Animations différentes** : Reanimated au lieu de Framer Motion
5. **Stockage asynchrone** : AsyncStorage au lieu de localStorage synchrone
6. **Performance** : Éviter les re-renders excessifs (plus critique sur mobile)
7. **Gestes tactiles** : Utiliser GestureHandler pour interactions complexes

---

## 12. Commandes de développement

```bash
# Démarrer le serveur de développement
npx expo start

# Scanner le QR code avec Expo Go (iOS/Android)
# Ou appuyer sur 'a' pour Android emulator
# Ou appuyer sur 'i' pour iOS simulator

# Build pour production
eas build --platform android
eas build --platform ios
```

---

## 13. Checklist de migration

- [ ] Créer nouveau projet Expo avec SDK 54
- [ ] Copier les fichiers de logique métier (utils/, contexts/, types/)
- [ ] Installer toutes les dépendances natives
- [ ] Configurer Expo Router avec _layout.tsx
- [ ] Migrer localStorage vers AsyncStorage dans LanguageContext
- [ ] Migrer localStorage vers AsyncStorage dans AudioContext
- [ ] Convertir tous les composants Web en React Native
- [ ] Remplacer motion/react par react-native-reanimated
- [ ] Remplacer @dnd-kit par react-native-draggable-flatlist
- [ ] Adapter le chargement des dictionnaires (Asset Loading)
- [ ] Tester sur iOS
- [ ] Tester sur Android
- [ ] Optimiser les performances
- [ ] Ajouter les icônes et splash screen
- [ ] Configurer app.json/app.config.js

---

## Conclusion

La migration vers React Native nécessite une refonte complète de l'interface utilisateur tout en conservant la logique métier (dictionnaire, calcul de points, gestion d'état). Les fichiers de traduction sont maintenant séparés en `fr.ts` et `en.ts` pour une meilleure organisation.

Pour toute question spécifique sur la migration d'un composant particulier, référez-vous à la documentation officielle :
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
