# WordCut Mobile - React Native / Expo SDK 54

## 🎮 Description

**WordCut** est un jeu de mots éducatif et stratégique où le joueur doit créer des mots de plus en plus courts en retirant des lettres, avec un système de points basé sur le nombre de lettres retirées et le réarrangement des lettres restantes.

### Objectif du jeu

À partir d'un mot d'au moins 5 lettres, créer des mots valides de plus en plus courts en retirant 1, 2 ou 3 lettres à chaque coup, jusqu'à obtenir un mot de 1, 2 ou 3 lettres. Chaque partie dispose d'un timer de 90 secondes.

---

## ✨ Fonctionnalités

### 🎯 Gameplay

- ✅ Génération aléatoire de mots de départ (≥ 5 lettres)
- ✅ Sélection de 1 à 3 lettres à retirer
- ✅ Réorganisation des lettres par drag-and-drop
- ✅ Validation en temps réel avec dictionnaire complet
- ✅ Système de points : base + bonus de réorganisation
- ✅ Historique des coups avec détail des points
- ✅ Timer de 90 secondes avec barre de progression
- ✅ Dialogue de victoire avec score final

### 🌍 Internationalisation

- ✅ Interface bilingue (Français / Anglais)
- ✅ Détection automatique de la langue de l'appareil
- ✅ Dictionnaires séparés pour chaque langue :
  - 🇫🇷 Français : 336 000 mots
  - 🇬🇧 Anglais : 370 000 mots
- ✅ Support de dictionnaires personnalisés (URL ou fichier .txt)
- ✅ Langue de l'interface indépendante du dictionnaire

### 🎵 Audio (Préparé pour implémentation future)

- ✅ Gestion du volume de la musique d'ambiance
- ✅ Gestion du volume des effets sonores
- ✅ Persistance des préférences audio

### 🎨 Design & UX

- ✅ Interface épurée et intuitive
- ✅ Animations fluides (React Native Reanimated)
- ✅ Gradients de couleur attractifs
- ✅ Feedback visuel immédiat
- ✅ Design adaptatif iOS et Android
- ✅ Mode portrait optimisé

---

## 📱 Screenshots

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Page Accueil  │  │   Jeu en cours  │  │  Règles du jeu  │
│                 │  │                 │  │                 │
│   [Logo]        │  │  Timer: 1:23    │  │  📖 Objectif    │
│   WordCut       │  │  Score: 15      │  │                 │
│                 │  │                 │  │  🎮 Comment     │
│   [▶ Jouer]     │  │  M A T E L A S  │  │     jouer       │
│   [📖 Règles]   │  │                 │  │                 │
│   [🌐 Langue]   │  │  [Sélectionner] │  │  ⭐ Points     │
│   [⚙ Paramètres]│  │  [Valider]      │  │                 │
│                 │  │                 │  │  [Commencer]    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+ et npm/yarn
- Expo CLI : `npm install -g expo-cli`
- Expo Go app sur votre téléphone (iOS/Android)
- Ou émulateur/simulateur iOS/Android

### Installation

```bash
# Cloner le repository
git clone https://github.com/yourcompany/wordcut-mobile.git
cd wordcut-mobile

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npx expo start
```

### Lancer l'application

```bash
# Scanner le QR code avec Expo Go (sur votre téléphone)
# OU

# Lancer sur iOS Simulator
npx expo start --ios

# Lancer sur Android Emulator
npx expo start --android
```

---

## 📂 Structure du projet

```
wordcut-mobile/
├── app/                    # Pages (Expo Router)
│   ├── _layout.tsx        # Layout racine + providers
│   ├── index.tsx          # Page d'accueil
│   ├── game.tsx           # Page du jeu
│   └── rules.tsx          # Page des règles
│
├── components/            # Composants réutilisables
│   ├── GameBoard.tsx
│   ├── LanguagePanel.tsx
│   ├── LetterTile.tsx
│   ├── ScoreDisplay.tsx
│   ├── SettingsPanel.tsx
│   ├── Timer.tsx
│   ├── WinDialog.tsx
│   └── WordHistory.tsx
│
├── contexts/              # Contextes React
│   ├── AudioContext.tsx
│   └── LanguageContext.tsx
│
├── utils/                 # Utilitaires
│   ├── dictionary.ts      # Gestion des dictionnaires
│   ├── storage.ts         # Wrapper AsyncStorage/SecureStore
│   └── locales/
│       ├── fr.ts          # Traductions françaises
│       ├── en.ts          # Traductions anglaises
│       └── index.ts
│
├── types/                 # Types TypeScript
│   └── game.ts
│
├── assets/                # Ressources
│   ├── dictionaries/
│   │   ├── fr_dict.txt
│   │   └── en_dict.txt
│   ├── icon.png
│   └── splash.png
│
└── package.json
```

---

## 🎯 Règles du jeu

### Objectif

Réduire le mot initial jusqu'à obtenir un mot de **1, 2 ou 3 lettres**.

### Comment jouer

1. **Commencez** avec un mot d'au moins 5 lettres
2. **Sélectionnez** 1, 2 ou 3 lettres à retirer
3. **Réorganisez** les lettres restantes (optionnel, pour bonus)
4. **Validez** votre nouveau mot
5. **Continuez** jusqu'à obtenir un mot de 1, 2 ou 3 lettres

### Système de points

#### Points de base (P1)
- 🟢 **3 points** si vous retirez **1 lettre**
- 🔵 **2 points** si vous retirez **2 lettres**
- 🟣 **1 point** si vous retirez **3 lettres**

#### Bonus de réorganisation (P2)
- 🎁 **+2 points** si vous réorganisez les lettres restantes

### Exemple

```
MATELAS (7 lettres)
  ↓ Retirer 3 lettres (A, A, S) + Réorganiser = METAL (1 + 2 = 3 pts)
METAL (5 lettres)
  ↓ Retirer 1 lettre (T) + Réorganiser = LAME (3 + 2 = 5 pts)
LAME (4 lettres)
  ↓ Retirer 1 lettre (L) = AME (3 + 0 = 3 pts)
AME (3 lettres)
  ↓ Retirer 1 lettre (M) + Réorganiser = EA (3 + 2 = 5 pts)
EA (2 lettres)
  ✅ VICTOIRE ! Score total : 16 points
```

### Contraintes

- ⏱️ **90 secondes** pour terminer la partie
- 📖 Chaque mot doit être **valide** dans le dictionnaire
- 🔄 Les lettres peuvent être réorganisées dans n'importe quel ordre

---

## 🛠️ Technologies utilisées

### Framework & Runtime
- **React Native** 0.76.5
- **Expo SDK** 54.0.0
- **TypeScript** 5.3.3

### Navigation
- **Expo Router** 4.0.0 (file-based routing)

### Stockage
- **AsyncStorage** 2.1.0 (données générales)
- **Expo SecureStore** 14.0.0 (données sensibles)

### Animations
- **React Native Reanimated** 3.16.1
- **React Native Gesture Handler** 2.20.2

### UI/UX
- **React Native Draggable FlatList** 4.0.1 (drag & drop)
- **React Native Modal** 13.0.1 (modales)
- **Expo Linear Gradient** 14.0.0 (gradients)
- **@expo/vector-icons** 14.0.0 (icônes)

### Internationalisation
- **Expo Localization** 16.0.0 (détection langue)

### Utilitaires
- **Expo Asset** 11.0.0 (chargement dictionnaires)
- **Expo Font** 13.0.0 (polices personnalisées)

---

## 📖 Documentation

- 📄 **[Guide de migration React Native](./REACT_NATIVE_MIGRATION_GUIDE.md)** - Guide complet pour migrer de React Web vers React Native
- 💻 **[Exemples de code React Native](./REACT_NATIVE_EXAMPLES.md)** - Exemples concrets de composants migrés
- 📁 **[Structure du projet](./PROJECT_STRUCTURE_REACT_NATIVE.md)** - Architecture détaillée du projet
- 📚 **[Documentation technique](./DOCUMENTATION_TECHNIQUE.md)** - Algorithmes et logique métier
- 🎨 **[Guidelines](./guidelines/Guidelines.md)** - Standards de code et bonnes pratiques

---

## 🔧 Configuration

### Variables d'environnement

Aucune variable d'environnement n'est requise pour le fonctionnement de base. Pour des fonctionnalités avancées (analytics, crash reporting), créez un fichier `.env` :

```env
# Optionnel
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
```

### Configuration Expo (app.json)

```json
{
  "expo": {
    "name": "WordCut",
    "slug": "wordcut",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "wordcut",
    "platforms": ["ios", "android"]
  }
}
```

---

## 🚢 Build et déploiement

### Build de développement

```bash
# Build APK pour Android
eas build --profile preview --platform android

# Build pour iOS Simulator
eas build --profile development --platform ios
```

### Build de production

```bash
# Build pour Android (App Bundle)
eas build --profile production --platform android

# Build pour iOS (IPA)
eas build --profile production --platform ios

# Build pour les deux plateformes
eas build --profile production --platform all
```

### Soumission aux stores

```bash
# Submit vers Google Play Store
eas submit --platform android

# Submit vers Apple App Store
eas submit --platform ios
```

---

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Linter
npm run lint

# Type checking
npm run type-check
```

---

## 📊 Performance

### Optimisations implémentées

- ✅ Dictionnaires indexés par longueur (O(1) lookup)
- ✅ React.memo() sur composants qui re-render souvent
- ✅ useMemo() pour calculs coûteux
- ✅ useCallback() pour handlers d'événements
- ✅ Lazy loading des dictionnaires
- ✅ AsyncStorage pour persistance rapide
- ✅ Animations natives (Reanimated)

### Métriques cibles

- 🎯 Time to Interactive : < 2s
- 🎯 FPS : 60fps constant
- 🎯 Bundle size : < 10MB
- 🎯 Memory usage : < 100MB

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- TypeScript strict mode
- ESLint + Prettier
- Commits conventionnels (Conventional Commits)
- Tests unitaires pour nouvelle logique métier

---

## 📝 Changelog

### Version 1.0.0 (2025-01)

- 🎉 Version initiale
- ✅ Gameplay complet avec timer
- ✅ Support bilingue (FR/EN)
- ✅ Dictionnaires personnalisés
- ✅ Animations fluides
- ✅ Sauvegarde des préférences

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 👥 Auteurs

- Développeur principal - [Votre Nom](https://github.com/yourname)

---

## 🙏 Remerciements

- Dictionnaires français et anglais provenant de sources open source
- Icônes de [@expo/vector-icons](https://icons.expo.fyi/)
- Inspiration de jeux de mots classiques

---

## 📞 Support

Pour toute question ou problème :

- 🐛 Ouvrir une [issue](https://github.com/yourcompany/wordcut-mobile/issues)
- 📧 Email : support@wordcut.app
- 💬 Discord : [WordCut Community](https://discord.gg/wordcut)

---

## 🔗 Liens utiles

- 🌐 [Site web](https://wordcut.app)
- 📱 [App Store](https://apps.apple.com/app/wordcut)
- 🤖 [Google Play](https://play.google.com/store/apps/wordcut)
- 🐦 [Twitter](https://twitter.com/wordcut)

---

**Bon jeu ! 🎮✨**
