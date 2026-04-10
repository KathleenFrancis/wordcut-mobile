// Système de dictionnaire pour WordCut (React Native version)
// Charge les dictionnaires depuis les assets

import { Asset } from 'expo-asset';
import { DictionaryLanguage } from '../contexts/LanguageContext';

// Structure de données : HashMap indexée par longueur pour O(1) lookup
let currentDictionary: Record<number, Set<string>> = {};
let currentLanguage: DictionaryLanguage | null = null;

// Charger et parser un fichier de dictionnaire
function loadDictionaryFromFile(fileContent: string): Record<number, Set<string>> {
  const dictionary: Record<number, Set<string>> = {};
  
  // Parser le fichier : un mot par ligne
  const words = fileContent
    .split(/\r?\n/)
    .map(word => word.trim().toLowerCase())
    .filter(word => word.length > 0);
  
  // Organiser par longueur pour optimiser la recherche
  words.forEach(word => {
    const length = word.length;
    if (!dictionary[length]) {
      dictionary[length] = new Set();
    }
    dictionary[length].add(word);
  });
  
  return dictionary;
}

// Charger un dictionnaire depuis une URL
export async function loadDictionaryFromURL(url: string): Promise<Record<number, Set<string>>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary: ${response.statusText}`);
    }
    const text = await response.text();
    return loadDictionaryFromFile(text);
  } catch (error) {
    console.error('Error loading dictionary from URL:', error);
    throw error;
  }
}

// Charger un dictionnaire depuis un asset Expo
export async function loadDictionaryFromAsset(language: 'fr' | 'en'): Promise<Record<number, Set<string>>> {
  try {
    // Les fichiers doivent être placés dans assets/dictionaries/
    // Exemple: assets/dictionaries/fr_dict.txt
    const assetModule = language === 'fr'
      ? require('../../assets/dictionaries/fr_dict.txt')
      : require('../../assets/dictionaries/en_dict.txt');
    
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    
    const response = await fetch(asset.localUri!);
    const text = await response.text();
    
    return loadDictionaryFromFile(text);
  } catch (error) {
    console.error('Error loading dictionary from asset:', error);
    throw error;
  }
}

// Cache des dictionnaires chargés
const dictionaryCache: Record<string, Record<number, Set<string>>> = {};

// Initialiser le cache avec des dictionnaires vides (seront chargés à la demande)
let isInitializing = false;

// Ajouter un dictionnaire personnalisé au cache
export function addCustomDictionaryToCache(id: string, dictionary: Record<number, Set<string>>) {
  dictionaryCache[id] = dictionary;
}

// Initialiser le dictionnaire pour une langue donnée
export async function initializeDictionary(language: DictionaryLanguage): Promise<void> {
  if (currentLanguage === language && Object.keys(currentDictionary).length > 0) {
    return; // Déjà chargé
  }

  if (isInitializing) {
    return; // Déjà en cours de chargement
  }

  isInitializing = true;

  try {
    // Vérifier si le dictionnaire existe dans le cache
    if (dictionaryCache[language]) {
      currentDictionary = dictionaryCache[language];
      currentLanguage = language;
      isInitializing = false;
      return;
    }

    // Charger depuis les assets pour FR et EN
    if (language === 'fr' || language === 'en') {
      const dict = await loadDictionaryFromAsset(language);
      dictionaryCache[language] = dict;
      currentDictionary = dict;
      currentLanguage = language;
    } else {
      // Pour les dictionnaires personnalisés, ils doivent déjà être dans le cache
      console.warn(`Dictionary for language "${language}" not found in cache`);
      // Fallback vers français
      if (!dictionaryCache['fr']) {
        const dict = await loadDictionaryFromAsset('fr');
        dictionaryCache['fr'] = dict;
      }
      currentDictionary = dictionaryCache['fr'];
      currentLanguage = 'fr';
    }
  } catch (error) {
    console.error('Error initializing dictionary:', error);
    // En cas d'erreur, essayer de charger le dictionnaire français
    try {
      const dict = await loadDictionaryFromAsset('fr');
      dictionaryCache['fr'] = dict;
      currentDictionary = dict;
      currentLanguage = 'fr';
    } catch (fallbackError) {
      console.error('Failed to load fallback dictionary:', fallbackError);
    }
  } finally {
    isInitializing = false;
  }
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
    .filter(length => length >= minLength && currentDictionary[length].size > 0);
  
  if (possibleLengths.length === 0) {
    throw new Error('No words available in dictionary');
  }
  
  // Sélection aléatoire de la longueur
  const randomLength = possibleLengths[
    Math.floor(Math.random() * possibleLengths.length)
  ];
  
  // Conversion Set → Array
  const wordsOfLength = Array.from(currentDictionary[randomLength]);
  
  // Sélection aléatoire du mot
  return wordsOfLength[
    Math.floor(Math.random() * wordsOfLength.length)
  ];
}

// Calculer les points pour un coup
export function calculatePoints(
  originalWord: string,
  newWord: string,
  removedCount: number
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
