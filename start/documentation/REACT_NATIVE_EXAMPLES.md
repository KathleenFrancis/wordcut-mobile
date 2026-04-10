# Exemples de Code React Native

Ce fichier contient des exemples concrets de composants migrés vers React Native.

---

## LanguageContext adapté pour React Native

```typescript
// contexts/LanguageContext.tsx (React Native version)
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storage } from '../utils/storage';
import * as Localization from 'expo-localization';

export type Language = 'fr' | 'en' | 'system';
export type DictionaryLanguage = 'fr' | 'en' | string;

interface CustomDictionary {
  id: string;
  name: string;
  words: Set<string>;
  source: 'url' | 'file';
  sourceValue: string;
}

interface LanguageContextType {
  uiLanguage: Language;
  setUILanguage: (lang: Language) => Promise<void>;
  getEffectiveUILanguage: () => 'fr' | 'en';
  dictionaryLanguage: DictionaryLanguage;
  setDictionaryLanguage: (lang: DictionaryLanguage) => Promise<void>;
  customDictionaries: CustomDictionary[];
  addCustomDictionary: (dict: CustomDictionary) => Promise<void>;
  removeCustomDictionary: (id: string) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [uiLanguage, setUILanguageState] = useState<Language>('system');
  const [dictionaryLanguage, setDictionaryLanguageState] = useState<DictionaryLanguage>('fr');
  const [customDictionaries, setCustomDictionaries] = useState<CustomDictionary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les préférences au démarrage
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedUILang, savedDictLang, savedCustomDicts] = await Promise.all([
        storage.getItem('wordcut-ui-language'),
        storage.getItem('wordcut-dictionary-language'),
        storage.getItem('wordcut-custom-dictionaries'),
      ]);

      if (savedUILang === 'fr' || savedUILang === 'en' || savedUILang === 'system') {
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
            }))
          );
        } catch (e) {
          console.error('Error parsing custom dictionaries:', e);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEffectiveUILanguage = (): 'fr' | 'en' => {
    if (uiLanguage === 'system') {
      // Utiliser Expo Localization pour détecter la langue
      const locale = Localization.getLocales()[0];
      if (locale?.languageCode === 'fr') return 'fr';
      return 'en';
    }
    return uiLanguage;
  };

  const setUILanguage = async (lang: Language) => {
    setUILanguageState(lang);
    await storage.setItem('wordcut-ui-language', lang);
  };

  const setDictionaryLanguage = async (lang: DictionaryLanguage) => {
    setDictionaryLanguageState(lang);
    await storage.setItem('wordcut-dictionary-language', lang);
  };

  const addCustomDictionary = async (dict: CustomDictionary) => {
    const newDicts = [...customDictionaries, dict];
    setCustomDictionaries(newDicts);
    
    const toSave = newDicts.map(d => ({
      ...d,
      words: Array.from(d.words),
    }));
    await storage.setItem('wordcut-custom-dictionaries', JSON.stringify(toSave));
  };

  const removeCustomDictionary = async (id: string) => {
    const newDicts = customDictionaries.filter(d => d.id !== id);
    setCustomDictionaries(newDicts);
    
    const toSave = newDicts.map(d => ({
      ...d,
      words: Array.from(d.words),
    }));
    await storage.setItem('wordcut-custom-dictionaries', JSON.stringify(toSave));
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

---

## Page d'accueil (Home) en React Native

```typescript
// app/index.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { LanguagePanel } from '../components/LanguagePanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <LinearGradient
      colors={['#dbeafe', '#e9d5ff', '#fce7f3']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {/* Logo et titre */}
        <Animated.View 
          entering={FadeInDown.delay(0).springify()}
          style={styles.header}
        >
          <Text style={styles.title}>{t.home.title}</Text>
          <Text style={styles.subtitle}>{t.home.subtitle}</Text>
        </Animated.View>

        {/* Menu principal */}
        <View style={styles.menu}>
          {/* Bouton Jouer */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Link href="/game" asChild>
              <Pressable style={styles.primaryButton}>
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.primaryButtonText}>{t.home.playButton}</Text>
              </Pressable>
            </Link>
          </Animated.View>

          {/* Bouton Règles */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Link href="/rules" asChild>
              <Pressable style={styles.secondaryButton}>
                <Ionicons name="book-outline" size={24} color="#374151" />
                <Text style={styles.secondaryButtonText}>{t.home.rulesButton}</Text>
              </Pressable>
            </Link>
          </Animated.View>

          {/* Bouton Langue */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Pressable
              style={styles.accentButton}
              onPress={() => setIsLanguagePanelOpen(true)}
            >
              <Ionicons name="language" size={24} color="#fff" />
              <Text style={styles.accentButtonText}>{t.home.language}</Text>
            </Pressable>
          </Animated.View>

          {/* Bouton Paramètres */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setIsSettingsOpen(true)}
            >
              <Ionicons name="settings-outline" size={24} color="#374151" />
              <Text style={styles.secondaryButtonText}>{t.settings.title}</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Version */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </Animated.View>
      </View>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <LanguagePanel
        isOpen={isLanguagePanelOpen}
        onClose={() => setIsLanguagePanelOpen(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #2563eb, #9333ea, #ec4899)',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
  },
  menu: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  accentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accentButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  version: {
    marginTop: 48,
    fontSize: 14,
    color: '#9ca3af',
  },
});
```

---

## Composant Timer en React Native

```typescript
// components/Timer.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export function Timer({ initialTime, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  const width = useSharedValue(100);

  useEffect(() => {
    setTimeLeft(initialTime);
    width.value = 100;
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        const newTime = prev - 1;
        width.value = withTiming((newTime / initialTime) * 100, { duration: 300 });
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;
  const isLowTime = timeLeft <= 20;
  const isCritical = timeLeft <= 10;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const iconColor = isCritical ? '#dc2626' : isLowTime ? '#ea580c' : '#3b82f6';
  const textColor = isCritical ? '#dc2626' : isLowTime ? '#ea580c' : '#111827';

  return (
    <View style={[styles.container, isCritical && styles.containerCritical]}>
      <View style={styles.content}>
        <Ionicons name="timer-outline" size={20} color={iconColor} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t.game.timeRemaining}</Text>
          <Text style={[styles.time, { color: textColor }]}>{timeDisplay}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            animatedStyle,
            {
              backgroundColor: isCritical ? '#dc2626' : isLowTime ? '#ea580c' : '#3b82f6',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  containerCritical: {
    // Animation pulse pourrait être ajoutée ici
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 8,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },
});
```

---

## Composant LetterTile draggable

```typescript
// components/LetterTile.tsx
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

interface LetterTileProps {
  letter: string;
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function LetterTile({ 
  letter, 
  isSelected = false, 
  onPress, 
  disabled = false 
}: LetterTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.tile,
          isSelected && styles.tileSelected,
          disabled && styles.tileDisabled,
        ]}
      >
        <Text style={[styles.letter, isSelected && styles.letterSelected]}>
          {letter.toUpperCase()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93c5fd',
  },
  tileSelected: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  tileDisabled: {
    opacity: 0.5,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  letterSelected: {
    color: '#fff',
  },
});
```

---

## Configuration app.json pour Expo

```json
{
  "expo": {
    "name": "WordCut",
    "slug": "wordcut",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.wordcut"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.wordcut"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true,
            "enableShrinkResourcesInReleaseBuilds": true
          }
        }
      ]
    ],
    "scheme": "wordcut",
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## Ces exemples montrent :

1. ✅ **Stockage asynchrone** avec AsyncStorage
2. ✅ **Animations** avec Reanimated 3
3. ✅ **Navigation** avec Expo Router
4. ✅ **Composants natifs** (View, Text, Pressable)
5. ✅ **Icônes** avec @expo/vector-icons
6. ✅ **Gradients** avec expo-linear-gradient
7. ✅ **Gestion d'état** cohérente
8. ✅ **Traductions** séparées

Le code est prêt pour React Native / Expo SDK 54 ! 🎉
