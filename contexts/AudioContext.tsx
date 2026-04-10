import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storage } from '../utils/storage';

interface AudioSettings {
  musicVolume: number; // 0-100
  sfxVolume: number;   // 0-100
}

interface AudioContextType {
  settings: AudioSettings;
  setMusicVolume: (volume: number) => Promise<void>;
  setSfxVolume: (volume: number) => Promise<void>;
  playSound: (soundName: string) => void;
  isLoading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>({
    musicVolume: 50,
    sfxVolume: 50,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres au démarrage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedMusicVolume, savedSfxVolume] = await Promise.all([
        storage.getItem('wordcut-music-volume'),
        storage.getItem('wordcut-sfx-volume'),
      ]);

      setSettings({
        musicVolume: savedMusicVolume ? parseInt(savedMusicVolume, 10) : 50,
        sfxVolume: savedSfxVolume ? parseInt(savedSfxVolume, 10) : 50,
      });
    } catch (error) {
      console.error('Error loading audio settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setMusicVolume = async (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setSettings(prev => ({ ...prev, musicVolume: clampedVolume }));
    await storage.setItem('wordcut-music-volume', clampedVolume.toString());
    
    // TODO: Implémenter la logique audio réelle avec expo-av
    // Exemple: backgroundMusic.setVolumeAsync(clampedVolume / 100);
  };

  const setSfxVolume = async (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setSettings(prev => ({ ...prev, sfxVolume: clampedVolume }));
    await storage.setItem('wordcut-sfx-volume', clampedVolume.toString());
  };

  const playSound = (soundName: string) => {
    // TODO: Implémenter la lecture des sons avec expo-av
    // Exemple:
    // const sound = new Audio.Sound();
    // await sound.loadAsync(require(`../assets/sounds/${soundName}.mp3`));
    // await sound.setVolumeAsync(settings.sfxVolume / 100);
    // await sound.playAsync();
    
    console.log(`Playing sound: ${soundName} at volume ${settings.sfxVolume}`);
  };

  return (
    <AudioContext.Provider
      value={{
        settings,
        setMusicVolume,
        setSfxVolume,
        playSound,
        isLoading,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
