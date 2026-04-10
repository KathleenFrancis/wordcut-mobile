# WordCut Mobile - React Native / Expo

Application mobile de jeu de mots développée avec React Native et Expo SDK 54.

## 📋 Prérequis

- Node.js 18+ et npm/yarn/pnpm
- Expo CLI : `npm install -g expo-cli`
- Expo Go app sur votre téléphone (iOS/Android)
- OU émulateur/simulateur iOS/Android

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Ou avec yarn
yarn install

# Ou avec pnpm
pnpm install
```

## 📁 Ajouter les fichiers de dictionnaires

Vous devez ajouter les fichiers de dictionnaires dans le dossier `assets/dictionnaires/` :

```
assets/
└── dictionaries/
    ├── fr_dict.txt    # Dictionnaire français (336 000 mots)
    └── en_dict.txt    # Dictionnaire anglais (370 000 mots)
```

Ces fichiers doivent contenir un mot par ligne, encodés en UTF-8.

## 🎮 Lancer l'application

```bash
# Démarrer le serveur de développement
npm start

# Ou avec des options spécifiques :
npm run android   # Lancer sur Android
npm run ios       # Lancer sur iOS
npm run web       # Lancer sur navigateur web
```

### Tester sur votre téléphone

1. Installez l'application **Expo Go** depuis l'App Store (iOS) ou Google Play (Android)
2. Lancez `npm start`
3. Scannez le QR code affiché :
   - iOS : Utilisez l'app Appareil photo
   - Android : Utilisez l'app Expo Go

### Tester sur un émulateur

#### Android

```bash
# Assurez-vous d'avoir Android Studio installé avec un émulateur configuré
npm run android
```

#### iOS (Mac uniquement)

```bash
# Assurez-vous d'avoir Xcode installé avec un simulateur configuré
npm run ios
```

## 📦 Structure du projet

```
src-expo/
├── app/                          # Pages (Expo Router)
│   ├── _layout.tsx              # Layout racine avec providers
│   ├── index.tsx                # Page d'accueil
│   ├── game.tsx                 # Page du jeu
│   ├── rules.tsx                # Page des règles
│   └── +not-found.tsx           # Page 404
│
├── components/                   # Composants réutilisables
│   ├── GameBoard.tsx
│   ├── LanguagePanel.tsx
│   ├── LetterTile.tsx
│   ├── ScoreDisplay.tsx
│   ├── SettingsPanel.tsx
│   ├── Timer.tsx
│   ├── WinDialog.tsx
│   └── WordHistory.tsx
│
├── contexts/                     # Contextes React
│   ├── AudioContext.tsx
│   └── LanguageContext.tsx
│
├── utils/                        # Utilitaires
│   ├── dictionary.ts            # Gestion des dictionnaires
│   ├── storage.ts               # Wrapper AsyncStorage/SecureStore
│   └── locales/
│       ├── fr.ts               # Traductions françaises
│       ├── en.ts               # Traductions anglaises
│       └── index.ts
│
├── types/                        # Types TypeScript
│   └── game.ts
│
├── constants/                    # Constantes
│   ├── Colors.ts
│   └── Sizes.ts
│
├── assets/                       # Ressources
│   ├── dictionaries/
│   │   ├── fr_dict.txt
│   │   └── en_dict.txt
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
│
├── app.json                      # Configuration Expo
├── package.json                  # Dépendances npm
├── tsconfig.json                 # Configuration TypeScript
├── babel.config.js               # Configuration Babel
└── metro.config.js               # Configuration Metro bundler
```

## 🎯 Fonctionnalités

### Gameplay

- ✅ Génération aléatoire de mots de départ (≥ 5 lettres)
- ✅ Sélection de 1 à 3 lettres à retirer
- ✅ Réorganisation des lettres par drag-and-drop
- ✅ Validation en temps réel avec dictionnaire
- ✅ Système de points (base + bonus de réorganisation)
- ✅ Historique des coups
- ✅ Timer de 90 secondes
- ✅ Dialogue de victoire

### Internationalisation

- ✅ Interface bilingue (Français / Anglais)
- ✅ Détection automatique de la langue de l'appareil
- ✅ Dictionnaires séparés (FR: 336k mots, EN: 370k mots)
- ✅ Support de dictionnaires personnalisés via URL

### Audio

- ✅ Gestion du volume de la musique
- ✅ Gestion du volume des effets sonores
- ✅ Persistance des préférences

## 🛠️ Développement

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Clear cache

Si vous rencontrez des problèmes, essayez de nettoyer le cache :

```bash
npx expo start --clear
```

## 📱 Build de production

### Configuration EAS (Expo Application Services)

1. Installez EAS CLI :
```bash
npm install -g eas-cli
```

2. Connectez-vous à votre compte Expo :
```bash
eas login
```

3. Configurez le projet :
```bash
eas build:configure
```

### Build Android (APK)

```bash
eas build --platform android --profile preview
```

### Build iOS

```bash
eas build --platform ios --profile production
```

### Build pour les deux plateformes

```bash
eas build --platform all
```

## 🚢 Déploiement

### Google Play Store

```bash
eas submit --platform android
```

### Apple App Store

```bash
eas submit --platform ios
```

## 📝 Notes importantes

### Dictionnaires

Les fichiers `fr_dict.txt` et `en_dict.txt` ne sont PAS inclus dans ce repository car ils sont trop volumineux. Vous devez les obtenir séparément et les placer dans `assets/dictionaries/`.

Format requis :
- Un mot par ligne
- Encodage UTF-8
- Minuscules recommandées

### Performance

- Les dictionnaires sont chargés de manière asynchrone au démarrage
- Utilisez la mise en cache pour éviter de recharger les dictionnaires
- Les animations utilisent la bibliothèque native Reanimated pour des performances optimales

### Stockage

- Les préférences utilisateur sont sauvegardées dans AsyncStorage
- Les dictionnaires personnalisés sont également sauvegardés localement
- SecureStore est disponible mais non utilisé actuellement

## 🐛 Problèmes courants

### Erreur "Metro bundler crashed"

```bash
npx expo start --clear
```

### Erreur "Unable to resolve module"

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Les dictionnaires ne se chargent pas

Vérifiez que les fichiers `fr_dict.txt` et `en_dict.txt` sont présents dans `assets/dictionaries/` et que le fichier `metro.config.js` inclut l'extension `.txt`.

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 📄 Licence

MIT

## 👥 Auteurs

- Développeur principal - Votre Nom

---

**Bon développement ! 🎮✨**
