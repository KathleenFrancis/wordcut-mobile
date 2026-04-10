# 🚀 Quick Start - WordCut Mobile

Guide de démarrage rapide pour lancer l'application en 5 minutes.

## ⚡ Installation rapide

```bash
# 1. Aller dans le dossier
cd src-expo

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npm start
```

## 📱 Tester immédiatement

### Option 1 : Sur votre téléphone (Recommandé)

1. **Installez Expo Go** sur votre téléphone :
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android : [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Lancez** l'application :
   ```bash
   npm start
   ```

3. **Scannez le QR code** :
   - **iOS** : Utilisez l'app Appareil photo
   - **Android** : Utilisez l'app Expo Go directement

✅ L'application se lance sur votre téléphone en quelques secondes !

### Option 2 : Sur un émulateur

#### Android

```bash
# Assurez-vous d'avoir Android Studio + émulateur installé
npm run android
```

#### iOS (Mac uniquement)

```bash
# Assurez-vous d'avoir Xcode + simulateur installé
npm run ios
```

## ⚠️ Important : Dictionnaires

Par défaut, l'application **ne contient pas les fichiers de dictionnaires** (ils sont trop volumineux pour Git).

### Ajout manuel

1. Créez le dossier :
   ```bash
   mkdir -p assets/dictionaries
   ```

2. Ajoutez les fichiers :
   ```
   assets/dictionaries/
   ├── fr_dict.txt   (336 000 mots, ~3-4 MB)
   └── en_dict.txt   (370 000 mots, ~3-4 MB)
   ```

### Format des dictionnaires

- Un mot par ligne
- Encodage UTF-8
- Minuscules recommandées
- Exemple :
  ```
  bonjour
  maison
  ordinateur
  ...
  ```

### Tester sans dictionnaires complets

Pour tester rapidement, créez des dictionnaires de test :

```bash
# Dictionnaire français minimal
cat > assets/dictionaries/fr_dict.txt << 'EOF'
bonjour
maison
mais
ami
et
le
la
un
une
ordinateur
clavier
souris
ecran
table
chaise
livre
stylo
EOF

# Dictionnaire anglais minimal  
cat > assets/dictionaries/en_dict.txt << 'EOF'
hello
house
but
friend
and
the
a
an
computer
keyboard
mouse
screen
table
chair
book
pen
EOF
```

⚠️ **Attention** : Avec ces dictionnaires minimalistes, beaucoup de mots ne seront pas reconnus pendant le jeu.

## 🎮 Tester l'application

### 1. Page d'accueil

- Bouton **Jouer** → Lance une partie
- Bouton **Règles** → Explications du jeu
- Bouton **Langue** → Changer interface et dictionnaire
- Bouton **Paramètres** → Volume musique/SFX

### 2. Jouer une partie

1. Un mot de 5+ lettres apparaît
2. Tapez sur 1-3 lettres pour les sélectionner (rouge)
3. Faites glisser les lettres pour les réorganiser (bonus +2 pts)
4. Appuyez sur **Valider**
5. Le nouveau mot devient le mot actuel
6. Continuez jusqu'à avoir un mot de 1-3 lettres
7. Vous avez 90 secondes !

### 3. Changer la langue

1. Page d'accueil → **Langue**
2. **Langue de l'interface** :
   - Langue de l'appareil (auto)
   - Français
   - Anglais
3. **Dictionnaire de mots** :
   - Français
   - Anglais
   - Ajouter un dictionnaire (via URL)

## 🐛 Résolution de problèmes

### L'app ne démarre pas

```bash
# Nettoyer le cache
npx expo start --clear

# Ou réinstaller
rm -rf node_modules
npm install
npx expo start
```

### Erreur "Metro bundler crashed"

```bash
npx expo start --clear
```

### Erreur "Unable to load dictionary"

Vérifiez que les fichiers existent :
```bash
ls -la assets/dictionaries/
```

Doit afficher :
```
fr_dict.txt
en_dict.txt
```

### Erreur "Unable to resolve module"

```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
npx expo start --clear
```

### L'app est lente

- Les dictionnaires sont chargés au démarrage (peut prendre 2-5 secondes)
- Après le premier chargement, ils sont en cache
- Sur un vrai appareil, c'est beaucoup plus rapide que sur émulateur

## 📦 Build pour production

### Android (APK)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Configurer
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS

```bash
# Build IPA (nécessite compte Apple Developer)
eas build --platform ios --profile production
```

## 🎯 Prochaines étapes

1. ✅ **Ajouter des dictionnaires complets** pour une vraie expérience de jeu
2. ✅ **Tester sur iOS et Android** pour vérifier la compatibilité
3. ✅ **Personnaliser** :
   - Icônes dans `assets/`
   - Splash screen
   - Bundle identifier dans `app.json`
4. ✅ **Implémenter l'audio** (optionnel) :
   - Installer `expo-av`
   - Ajouter fichiers audio dans `assets/sounds/`
   - Compléter `AudioContext.tsx`

## 📚 Documentation complète

- [README.md](./README.md) - Documentation complète
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Détails de la migration
- [../REACT_NATIVE_MIGRATION_GUIDE.md](../REACT_NATIVE_MIGRATION_GUIDE.md) - Guide de migration

## 💡 Conseils

### Performance

- Testez sur un **vrai appareil** (plus rapide qu'émulateur)
- Les animations sont optimisées pour 60 FPS
- Le drag & drop est natif (très fluide)

### Développement

- Utilisez **Expo Go** pour un développement rapide
- Les changements sont mis à jour en temps réel (Fast Refresh)
- Secouez votre téléphone pour ouvrir le menu développeur

### Debug

- Secouez le téléphone → **Toggle Element Inspector**
- Dans le terminal → Appuyez sur **j** pour ouvrir le debugger
- Logs : `console.log()` apparaît dans le terminal

## ✨ C'est parti !

Vous êtes prêt à lancer WordCut Mobile ! 🎮

```bash
npm start
```

Scannez le QR code et amusez-vous bien ! 🎉

---

**Besoin d'aide ?** Consultez [README.md](./README.md) pour plus de détails.
