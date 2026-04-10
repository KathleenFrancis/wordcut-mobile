// Système de dictionnaire pour WordCut
// Charge les dictionnaires depuis les fichiers fr_dict.txt et en_dict.txt

import { DictionaryLanguage } from "../contexts/LanguageContext";
import enDictFile from "../imports/en_dict.txt?raw";
import frDictFile from "../imports/fr_dict.txt?raw";

let currentDictionary: Record<number, Set<string>> = {};
let currentLanguage: DictionaryLanguage | null = null;

// Charger et parser un fichier de dictionnaire
function loadDictionaryFromFile(
  fileContent: string,
): Record<number, Set<string>> {
  const dictionary: Record<number, Set<string>> = {};

  // Parser le fichier : un mot par ligne
  const words = fileContent
    .split(/\r?\n/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0);

  // Organiser par longueur pour optimiser la recherche
  words.forEach((word) => {
    const length = word.length;
    if (!dictionary[length]) {
      dictionary[length] = new Set();
    }
    dictionary[length].add(word);
  });

  return dictionary;
}

// Charger un dictionnaire depuis une URL
export async function loadDictionaryFromURL(
  url: string,
): Promise<Record<number, Set<string>>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary: ${response.statusText}`);
    }
    const text = await response.text();
    return loadDictionaryFromFile(text);
  } catch (error) {
    console.error("Error loading dictionary from URL:", error);
    throw error;
  }
}

// Charger un dictionnaire depuis un fichier local
export function loadDictionaryFromLocalFile(
  file: File,
): Promise<Record<number, Set<string>>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const dict = loadDictionaryFromFile(text);
        resolve(dict);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Cache des dictionnaires chargés
const dictionaryCache: Record<string, Record<number, Set<string>>> = {
  fr: loadDictionaryFromFile(frDictFile),
  en: loadDictionaryFromFile(enDictFile),
};

// Ajouter un dictionnaire personnalisé au cache
export function addCustomDictionaryToCache(
  id: string,
  dictionary: Record<number, Set<string>>,
) {
  dictionaryCache[id] = dictionary;
}

// Initialiser le dictionnaire pour une langue donnée
export function initializeDictionary(language: DictionaryLanguage) {
  if (currentLanguage === language) {
    return; // Déjà chargé
  }

  // Vérifier si le dictionnaire existe dans le cache
  if (!dictionaryCache[language]) {
    console.warn(
      `Dictionary for language "${language}" not found, falling back to French`,
    );
    currentDictionary = dictionaryCache["fr"];
    currentLanguage = "fr";
    return;
  }

  currentDictionary = dictionaryCache[language];
  currentLanguage = language;
}

// Vérifier si un mot est valide
export function isValidWord(word: string): boolean {
  const normalizedWord = word.toLowerCase().trim();
  const length = normalizedWord.length;

  if (!currentDictionary[length]) {
    return false;
  }

  return currentDictionary[length].has(normalizedWord);
}

// Obtenir un mot de départ aléatoire (≥ 5 lettres)
export function getRandomStartWord(): string {
  const minLength = 5;

  // Filtrer les longueurs valides
  const possibleLengths = Object.keys(currentDictionary)
    .map(Number)
    .filter(
      (length) => length >= minLength && currentDictionary[length].size > 0,
    );

  if (possibleLengths.length === 0) {
    throw new Error("No words available in dictionary");
  }

  const randomLength =
    possibleLengths[Math.floor(Math.random() * possibleLengths.length)];

  const wordsOfLength = Array.from(currentDictionary[randomLength]);

  return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
}

// Calculer les points pour un coup
export function calculatePoints(
  originalWord: string,
  newWord: string,
  removedCount: number,
): { basePoints: number; reorderBonus: number; total: number } {
  // P1 : Points de base selon le nombre de lettres retirées
  let basePoints = 0;
  switch (removedCount) {
    case 1:
      basePoints = 3;
      break;
    case 2:
      basePoints = 2;
      break;
    case 3:
      basePoints = 1;
      break;
    default:
      basePoints = 0;
  }

  // P2 : Bonus de réorganisation (+2 si les lettres ont été réorganisées)
  const reorderBonus = isReordered(originalWord, newWord) ? 2 : 0;

  return {
    basePoints,
    reorderBonus,
    total: basePoints + reorderBonus,
  };
}

// Détecter si les lettres ont été réorganisées
function isReordered(originalWord: string, newWord: string): boolean {
  const original = originalWord.toLowerCase();
  const newW = newWord.toLowerCase();

  // Les mots doivent avoir la même longueur
  if (original.length !== newW.length) {
    return false;
  }

  // Vérifier si l'ordre a changé
  return original !== newW;
}

// Obtenir les statistiques du dictionnaire actuel
export function getDictionaryStats() {
  const stats = {
    totalWords: 0,
    byLength: {} as Record<number, number>,
  };

  Object.entries(currentDictionary).forEach(([length, words]) => {
    const len = Number(length);
    const count = words.size;
    stats.byLength[len] = count;
    stats.totalWords += count;
  });

  return stats;
}
