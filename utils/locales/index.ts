import { fr } from './fr';
import { en } from './en';

export type TranslationKeys = typeof fr;

export const translations = {
  fr,
  en,
};

export function useTranslation(language: 'fr' | 'en'): TranslationKeys {
  return translations[language];
}
