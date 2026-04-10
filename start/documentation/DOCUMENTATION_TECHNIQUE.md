# Documentation Technique et Académique - WordCut

## Table des Matières
1. [Description Générale du Fonctionnement](#1-description-générale-du-fonctionnement)
2. [Architecture de l'Application](#2-architecture-de-lapplication)
3. [Explication Détaillée du Code et des Algorithmes](#3-explication-détaillée-du-code-et-des-algorithmes)

---

## 1. Description Générale du Fonctionnement

### 1.1 Présentation du Jeu

**WordCut** est une application web interactive de type jeu de mots développée avec React et TypeScript. Le principe ludique repose sur la manipulation lexicale : à partir d'un mot initial d'au moins cinq lettres, le joueur doit créer une séquence de mots valides en retirant progressivement des lettres jusqu'à obtenir un mot de une à trois lettres.

### 1.2 Règles et Mécanique de Jeu

#### 1.2.1 Objectif
Réduire le mot initial jusqu'à obtenir un mot de 1, 2 ou 3 lettres tout en maximisant le score.

#### 1.2.2 Contraintes
- Le joueur peut retirer entre 1 et 3 lettres à chaque tour
- Chaque nouveau mot formé doit être valide selon le dictionnaire français intégré
- Le joueur dispose de 90 secondes pour compléter la partie
- Les lettres restantes peuvent être réorganisées pour former de nouveaux mots

#### 1.2.3 Système de Scoring

Le système de points est basé sur deux composantes :

**P1 - Points de base** (fonction du nombre de lettres retirées) :
```
f(n) = {
  3 points si n = 1
  2 points si n = 2
  1 point si n = 3
}
```

**P2 - Bonus de réorganisation** :
```
bonus = {
  +2 points si l'ordre des lettres a été modifié
  0 points sinon
}
```

**Score total par coup** : `Score = P1 + P2`

### 1.3 Fonctionnalités Principales

1. **Interface d'accueil** : Navigation vers le jeu, les règles, et les paramètres audio
2. **Système de timer** : Compte à rebours de 90 secondes avec indicateurs visuels
3. **Drag & Drop** : Réorganisation intuitive des lettres par glisser-déposer
4. **Validation lexicale** : Vérification automatique contre un dictionnaire français
5. **Historique de partie** : Traçabilité complète des coups joués et des points gagnés
6. **Paramètres audio** : Contrôle du volume de la musique et des effets sonores

---

## 2. Architecture de l'Application

### 2.1 Architecture Globale

L'application suit une architecture **component-based** typique des applications React modernes, avec une séparation claire des responsabilités selon le pattern **MVC adapté** :

```
┌─────────────────────────────────────────┐
│            App (Root)                   │
│  ┌────────────────────────────────┐    │
│  │     AudioProvider (Context)     │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │   RouterProvider          │  │    │
│  │  │   (React Router)          │  │    │
│  │  └──────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐   ┌───▼────┐   ┌───▼────┐
│  Home  │   │  Game  │   │ Rules  │
│  Page  │   │  Page  │   │  Page  │
└────────┘   └────────┘   └────────┘
                  │
    ┌─────────────┼─────────────────────┐
    │             │                     │
┌───▼──────┐ ┌───▼──────┐  ┌──────▼──────┐
│GameBoard │ │  Timer   │  │WordHistory  │
└──────────┘ └──────────┘  └─────────────┘
     │
┌────▼────────┐
│ LetterTile  │
└─────────────┘
```

### 2.2 Structure des Répertoires

```
src/app/
├── components/           # Composants réutilisables
│   ├── GameBoard.tsx    # Plateau de jeu principal
│   ├── LetterTile.tsx   # Tuile de lettre individuelle
│   ├── Timer.tsx        # Composant de chronométrage
│   ├── ScoreDisplay.tsx # Affichage du score
│   ├── WordHistory.tsx  # Historique des coups
│   ├── WinDialog.tsx    # Dialogue de victoire
│   ├── SettingsPanel.tsx # Panneau des paramètres
│   └── ui/              # Composants UI génériques
│
├── pages/               # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Game.tsx        # Page de jeu
│   └── Rules.tsx       # Page des règles
│
├── contexts/            # Contexts React
│   └── AudioContext.tsx # Gestion de l'état audio global
│
├── utils/              # Utilitaires
│   └── dictionary.ts   # Dictionnaire et algorithmes
│
├── types/              # Définitions TypeScript
│   └── game.ts         # Types du jeu
│
├── routes.tsx          # Configuration du routage
└── App.tsx             # Point d'entrée principal
```

### 2.3 Flux de Données

L'application utilise un **flux de données unidirectionnel** :

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
State Update (useState/Context)
    │
    ▼
React Re-render
    │
    ▼
UI Update
```

### 2.4 Gestion d'État

#### 2.4.1 État Local (useState)
Utilisé pour les états spécifiques aux composants :
- `GameBoard` : sélection des lettres, réorganisation
- `Timer` : compte à rebours
- `Game` : état de la partie courante

#### 2.4.2 État Global (Context API)
- `AudioContext` : paramètres audio partagés entre tous les composants

#### 2.4.3 Structure de l'État de Jeu

```typescript
interface GameState {
  currentWord: string;        // Mot actuel
  history: WordEntry[];       // Historique des coups
  totalScore: number;         // Score total accumulé
  isGameWon: boolean;         // État de victoire
}

interface WordEntry {
  word: string;               // Mot joué
  basePoints: number;         // Points de base (P1)
  reorderBonus: number;       // Bonus de réorganisation (P2)
  totalPoints: number;        // Total du coup
  removedCount: number;       // Nombre de lettres retirées
}
```

---

## 3. Explication Détaillée du Code et des Algorithmes

### 3.1 Algorithme de Validation des Mots

#### 3.1.1 Structure de Données du Dictionnaire

Le dictionnaire utilise une **table de hachage** (HashMap) indexée par la longueur des mots pour optimiser les recherches :

```typescript
dictionary: Record<number, Set<string>> = {
  1: Set(['a', 'y']),
  2: Set(['ai', 'an', 'as', ...]),
  3: Set(['aie', 'ail', 'air', ...]),
  // ... jusqu'à 7 lettres
}
```

**Complexité temporelle** : O(1) pour la recherche
**Complexité spatiale** : O(n) où n est le nombre total de mots

#### 3.1.2 Fonction de Validation

```typescript
function isValidWord(word: string): boolean {
  const normalizedWord = word.toLowerCase().trim();
  const length = normalizedWord.length;
  
  // Vérification de l'existence de la clé
  if (!dictionary[length]) {
    return false;
  }
  
  // Recherche O(1) dans le Set
  return dictionary[length].has(normalizedWord);
}
```

**Justification technique** :
- L'utilisation de `Set` garantit une recherche en O(1)
- La normalisation (toLowerCase, trim) assure la cohérence
- La pré-vérification de la longueur évite les accès inutiles

### 3.2 Algorithme de Calcul des Points

```typescript
function calculatePoints(
  originalWord: string,
  newWord: string,
  removedCount: number
): { basePoints: number; reorderBonus: number; total: number } {
  
  // Calcul P1 : Points de base
  let basePoints = 0;
  switch (removedCount) {
    case 1: basePoints = 3; break;
    case 2: basePoints = 2; break;
    case 3: basePoints = 1; break;
  }
  
  // Calcul P2 : Bonus de réorganisation
  const reorderBonus = isReordered(originalWord, newWord) ? 2 : 0;
  
  return {
    basePoints,
    reorderBonus,
    total: basePoints + reorderBonus
  };
}
```

#### 3.2.1 Algorithme de Détection de Réorganisation

```typescript
function isReordered(originalWord: string, newWord: string): boolean {
  // Extraction et tri des lettres
  const originalLetters = originalWord
    .toLowerCase()
    .split('')
    .sort()
    .join('');
  
  const newLetters = newWord
    .toLowerCase()
    .split('')
    .sort()
    .join('');
  
  // Vérification 1 : Les mêmes lettres sont présentes
  if (originalLetters !== newLetters) {
    return false;
  }
  
  // Vérification 2 : L'ordre a changé
  return originalWord.toLowerCase() !== newWord.toLowerCase();
}
```

**Complexité** : O(n log n) où n est la longueur du mot (due au tri)

**Principe** :
1. Trier les lettres pour comparer les ensembles
2. Vérifier que les lettres triées sont identiques (anagramme)
3. Vérifier que l'ordre original est différent

### 3.3 Système de Drag & Drop

L'application utilise la bibliothèque **@dnd-kit** pour implémenter le glisser-déposer :

#### 3.3.1 Structure du Composant Sortable

```typescript
function SortableLetterTile({ id, letter }: Props) {
  const {
    attributes,      // Attributs d'accessibilité
    listeners,       // Event handlers de drag
    setNodeRef,      // Référence DOM
    transform,       // Transformation CSS
    transition,      // Animation de transition
    isDragging,      // État de drag
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Contenu de la tuile */}
    </div>
  );
}
```

#### 3.3.2 Algorithme de Réorganisation

```typescript
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  
  if (over && active.id !== over.id) {
    setArrangedLetters((items) => {
      // Trouver les indices
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      // Utiliser arrayMove pour réorganiser
      return arrayMove(items, oldIndex, newIndex);
    });
  }
}
```

**Fonction arrayMove** :
```typescript
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
```

**Complexité** : O(n) où n est le nombre d'éléments

### 3.4 Système de Timer

#### 3.4.1 Implémentation du Compte à Rebours

```typescript
function Timer({ initialTime, onTimeUp, isRunning }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // Réinitialisation du timer
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);
  
  // Gestion du décompte
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  // Détection de fin de temps
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onTimeUp();
    }
  }, [timeLeft, isRunning, onTimeUp]);
  
  // Calcul du pourcentage
  const percentage = (timeLeft / initialTime) * 100;
  
  // Formatage MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (/* JSX avec barre de progression */);
}
```

**Justifications techniques** :
1. **Séparation des useEffect** : Évite les mises à jour d'état pendant le rendu
2. **Fonction de mise à jour fonctionnelle** : `setTimeLeft(prev => ...)` garantit la valeur la plus récente
3. **Cleanup du setInterval** : Prévient les fuites mémoire

#### 3.4.2 Indicateurs Visuels Progressifs

```typescript
const isLowTime = timeLeft <= 20;     // Seuil d'avertissement
const isCritical = timeLeft <= 10;    // Seuil critique

const colorClass = isCritical 
  ? 'text-red-600 bg-red-500'
  : isLowTime 
    ? 'text-orange-600 bg-orange-500'
    : 'text-gray-900 bg-gradient-to-r from-blue-500 to-green-500';
```

### 3.5 Algorithme de Génération du Mot Initial

```typescript
function getRandomStartWord(): string {
  const minLength = 5;
  
  // Filtrer les longueurs valides (≥ 5 lettres)
  const possibleLengths = Object.keys(dictionary)
    .map(Number)
    .filter(length => length >= minLength);
  
  // Sélection aléatoire de la longueur
  const randomLength = possibleLengths[
    Math.floor(Math.random() * possibleLengths.length)
  ];
  
  // Conversion Set → Array
  const wordsOfLength = Array.from(dictionary[randomLength]);
  
  // Sélection aléatoire du mot
  return wordsOfLength[
    Math.floor(Math.random() * wordsOfLength.length)
  ];
}
```

**Complexité** :
- Filtrage : O(k) où k est le nombre de longueurs possibles
- Conversion Set → Array : O(m) où m est le nombre de mots de la longueur sélectionnée
- Sélection : O(1)
- **Total** : O(k + m)

### 3.6 Gestion du Routage

#### 3.6.1 Configuration des Routes

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/game',
    Component: Game,
  },
  {
    path: '/rules',
    Component: Rules,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
```

**React Router v7** utilise le **Data Router Pattern** :
- Navigation côté client sans rechargement
- Gestion automatique de l'historique du navigateur
- Support du lazy loading des composants

### 3.7 Optimisations et Performances

#### 3.7.1 Mémoïsation avec React.memo

Pour éviter les re-renders inutiles :

```typescript
export const LetterTile = React.memo(
  forwardRef<HTMLButtonElement, Props>((props, ref) => {
    // Composant
  })
);
```

#### 3.7.2 AnimatePresence pour les Animations

```typescript
<AnimatePresence mode="popLayout">
  {letters.map((letter, index) => (
    <LetterTile key={`${currentWord}-${index}`} ... />
  ))}
</AnimatePresence>
```

**mode="popLayout"** : Les éléments sortants sont retirés du flux avant l'animation d'entrée

#### 3.7.3 Keys Stables

```typescript
key={`${currentWord}-${index}`}  // Évite les réutilisations incorrectes
```

### 3.8 Gestion des Erreurs

```typescript
const handleSubmitWord = (newWord: string, removedCount: number) => {
  setError('');  // Réinitialisation
  
  // Validation lexicale
  if (!isValidWord(newWord)) {
    setError(`"${newWord.toUpperCase()}" n'est pas un mot valide`);
    return;
  }
  
  // Suite du traitement...
};
```

**Stratégie** : Validation fail-fast avec feedback immédiat à l'utilisateur

---

## Conclusion

Cette application démontre l'application de plusieurs concepts fondamentaux en développement web moderne :

1. **Architecture Component-Based** : Séparation des préoccupations et réutilisabilité
2. **Structures de Données Efficaces** : HashMap pour O(1) lookup
3. **Algorithmes de Manipulation de Chaînes** : Tri, comparaison, anagrammes
4. **Gestion d'État Réactive** : Hooks React et Context API
5. **Interactions Utilisateur Avancées** : Drag & Drop, animations fluides
6. **Optimisation des Performances** : Mémoïsation, keys stables, cleanup proper

L'implémentation privilégie la **maintenabilité**, la **performance** et l'**expérience utilisateur**, tout en respectant les meilleures pratiques de développement React/TypeScript.
