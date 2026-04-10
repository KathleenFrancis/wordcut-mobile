import * as Localization from "expo-localization";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "../utils/storage";

export type Language = "fr" | "en" | "system";
export type DictionaryLanguage = "fr" | "en" | string;

interface CustomDictionary {
  id: string;
  name: string;
  words: Set<string>;
  source: "url" | "file";
  sourceValue: string;
}

interface LanguageContextType {
  uiLanguage: Language;
  setUILanguage: (lang: Language) => Promise<void>;
  getEffectiveUILanguage: () => "fr" | "en";
  dictionaryLanguage: DictionaryLanguage;
  setDictionaryLanguage: (lang: DictionaryLanguage) => Promise<void>;
  customDictionaries: CustomDictionary[];
  addCustomDictionary: (dict: CustomDictionary) => Promise<void>;
  removeCustomDictionary: (id: string) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [uiLanguage, setUILanguageState] = useState<Language>("system");
  const [dictionaryLanguage, setDictionaryLanguageState] =
    useState<DictionaryLanguage>("fr");
  const [customDictionaries, setCustomDictionaries] = useState<
    CustomDictionary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les préférences au démarrage
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedUILang, savedDictLang, savedCustomDicts] = await Promise.all([
        storage.getItem("wordcut-ui-language"),
        storage.getItem("wordcut-dictionary-language"),
        storage.getItem("wordcut-custom-dictionaries"),
      ]);

      if (
        savedUILang === "fr" ||
        savedUILang === "en" ||
        savedUILang === "system"
      ) {
        setUILanguageState(savedUILang);
      }

      if (savedDictLang) {
        setDictionaryLanguageState(savedDictLang);
      }

      if (savedCustomDicts) {
        try {
          const parsed = JSON.parse(savedCustomDicts);
          setCustomDictionaries(
            parsed.map((dict: any) => ({
              ...dict,
              words: new Set(dict.words || []),
            })),
          );
        } catch (e) {
          console.error("Error parsing custom dictionaries:", e);
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEffectiveUILanguage = (): "fr" | "en" => {
    if (uiLanguage === "system") {
      // Utiliser Expo Localization pour détecter la langue
      const locale = Localization.getLocales()[0];
      if (locale?.languageCode === "fr") return "fr";
      return "en";
    }
    return uiLanguage;
  };

  const setUILanguage = async (lang: Language) => {
    setUILanguageState(lang);
    await storage.setItem("wordcut-ui-language", lang);
  };

  const setDictionaryLanguage = async (lang: DictionaryLanguage) => {
    setDictionaryLanguageState(lang);
    await storage.setItem("wordcut-dictionary-language", lang);
  };

  const addCustomDictionary = async (dict: CustomDictionary) => {
    const newDicts = [...customDictionaries, dict];
    setCustomDictionaries(newDicts);

    const toSave = newDicts.map((d) => ({
      ...d,
      words: Array.from(d.words),
    }));
    await storage.setItem(
      "wordcut-custom-dictionaries",
      JSON.stringify(toSave),
    );
  };

  const removeCustomDictionary = async (id: string) => {
    const newDicts = customDictionaries.filter((d) => d.id !== id);
    setCustomDictionaries(newDicts);

    const toSave = newDicts.map((d) => ({
      ...d,
      words: Array.from(d.words),
    }));
    await storage.setItem(
      "wordcut-custom-dictionaries",
      JSON.stringify(toSave),
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        uiLanguage,
        setUILanguage,
        getEffectiveUILanguage,
        dictionaryLanguage,
        setDictionaryLanguage,
        customDictionaries,
        addCustomDictionary,
        removeCustomDictionary,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
