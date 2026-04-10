# Assets Directory

Ce dossier contient toutes les ressources statiques de l'application.

## 📁 Structure requise

```
assets/
├── dictionaries/           # ⚠️ REQUIS
│   ├── fr_dict.txt        # Dictionnaire français (336 000 mots)
│   └── en_dict.txt        # Dictionnaire anglais (370 000 mots)
│
├── icon.png               # ⚠️ REQUIS - Icône app (1024x1024px)
├── splash.png             # ⚠️ REQUIS - Splash screen
├── adaptive-icon.png      # ⚠️ REQUIS - Icône Android adaptative
├── favicon.png            # Favicon web (optionnel)
│
├── fonts/                 # Polices personnalisées (optionnel)
│   └── CustomFont.ttf
│
└── sounds/                # Sons et musique (optionnel)
    ├── music/
    │   └── background.mp3
    └── sfx/
        ├── success.mp3
        ├── error.mp3
        └── click.mp3
```

## ⚠️ Fichiers manquants

Les fichiers suivants ne sont **PAS inclus** dans le repository et doivent être ajoutés :

### 1. Dictionnaires (OBLIGATOIRE)

**Format** : Fichiers texte avec un mot par ligne, encodage UTF-8

**Emplacement** : `dictionaries/fr_dict.txt` et `dictionaries/en_dict.txt`

**Exemple de contenu** :
```
bonjour
maison
ordinateur
clavier
...
```

**Sources possibles** :
- [Lexique](http://www.lexique.org/) - Français
- [SCOWL](http://wordlist.aspell.net/) - Anglais
- Dictionnaires open source sur GitHub

### 2. Icônes (OBLIGATOIRE)

#### icon.png
- **Dimensions** : 1024x1024 pixels
- **Format** : PNG avec transparence
- **Utilisation** : Icône de l'application sur iOS/Android

#### splash.png
- **Dimensions** : 1242x2436 pixels (ou supérieur)
- **Format** : PNG
- **Utilisation** : Écran de démarrage

#### adaptive-icon.png
- **Dimensions** : 1024x1024 pixels
- **Format** : PNG avec transparence
- **Utilisation** : Icône adaptative Android
- **Note** : La partie centrale (66%) sera toujours visible

#### favicon.png
- **Dimensions** : 48x48 pixels minimum
- **Format** : PNG
- **Utilisation** : Favicon pour version web

### 3. Sons (OPTIONNEL)

Si vous souhaitez activer l'audio :

1. Ajoutez les fichiers MP3 dans `sounds/`
2. Installez `expo-av` : `npx expo install expo-av`
3. Complétez le code dans `contexts/AudioContext.tsx`

**Exemple** :
```typescript
// Dans AudioContext.tsx
const sound = new Audio.Sound();
await sound.loadAsync(require('../assets/sounds/sfx/success.mp3'));
await sound.setVolumeAsync(settings.sfxVolume / 100);
await sound.playAsync();
```

## 🎨 Générer des icônes

### Outils en ligne

- [Icon Kitchen](https://icon.kitchen/) - Générateur d'icônes Android/iOS
- [MakeAppIcon](https://makeappicon.com/) - Générateur multi-plateformes
- [AppIcon.co](https://appicon.co/) - Générateur gratuit

### Avec Figma/Sketch/Photoshop

1. Créez un design 1024x1024px
2. Exportez en PNG avec transparence
3. Utilisez le même design pour icon.png et adaptive-icon.png

### Splash screen

Recommendations :
- Fond uni (couleur dans app.json : `"backgroundColor": "#dbeafe"`)
- Logo centré
- Design simple et épuré
- Pas de texte (peut être coupé sur petits écrans)

## 📝 Dictionnaires de test

Pour tester rapidement sans dictionnaire complet :

### Créer un dictionnaire minimal

```bash
# Français (100 mots les plus courants)
cat > dictionaries/fr_dict.txt << 'EOF'
le
la
les
un
une
de
et
à
pour
dans
sur
avec
pas
que
qui
elle
il
ce
se
ne
je
tu
nous
vous
ils
elles
ou
où
mais
donc
car
ni
puis
EOF

# Anglais (100 mots les plus courants)
cat > dictionaries/en_dict.txt << 'EOF'
the
be
to
of
and
a
in
that
have
i
it
for
not
on
with
he
as
you
do
at
this
but
his
by
from
they
we
say
her
she
or
an
will
my
one
all
would
EOF
```

⚠️ **Attention** : Ces dictionnaires minimalistes ne permettront pas un jeu complet !

## 🔗 Liens utiles

### Dictionnaires

- [Liste de mots français](https://github.com/topics/french-dictionary)
- [Liste de mots anglais](https://github.com/topics/english-dictionary)
- [NLTK Corpora](https://www.nltk.org/nltk_data/) - Plusieurs langues

### Assets gratuits

- [FlatIcon](https://www.flaticon.com/) - Icônes gratuites
- [Unsplash](https://unsplash.com/) - Images gratuites
- [Freesound](https://freesound.org/) - Sons gratuits
- [OpenGameArt](https://opengameart.org/) - Assets de jeu

### Outils

- [TinyPNG](https://tinypng.com/) - Compression d'images
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimisation SVG
- [Audacity](https://www.audacityteam.org/) - Édition audio

## 🚀 Après avoir ajouté les assets

1. **Vérifiez** que tous les fichiers requis sont présents :
   ```bash
   ls -la dictionaries/
   ls -la *.png
   ```

2. **Nettoyez le cache** :
   ```bash
   npx expo start --clear
   ```

3. **Testez** l'application :
   ```bash
   npm start
   ```

## 📊 Tailles recommandées

| Fichier | Taille max | Note |
|---------|-----------|------|
| icon.png | < 1 MB | PNG optimisé |
| splash.png | < 2 MB | PNG optimisé |
| adaptive-icon.png | < 1 MB | PNG optimisé |
| fr_dict.txt | 3-5 MB | Texte brut |
| en_dict.txt | 3-5 MB | Texte brut |
| Sons (chacun) | < 500 KB | MP3 128kbps |

## ✅ Checklist

Avant de lancer l'application :

- [ ] `dictionaries/fr_dict.txt` existe
- [ ] `dictionaries/en_dict.txt` existe
- [ ] `icon.png` existe (1024x1024)
- [ ] `splash.png` existe
- [ ] `adaptive-icon.png` existe (1024x1024)
- [ ] `favicon.png` existe (optionnel)
- [ ] Les dictionnaires sont au format UTF-8
- [ ] Les dictionnaires contiennent au moins quelques mots

---

**Une fois tous les assets en place, l'application est prête à être lancée !** 🎉
