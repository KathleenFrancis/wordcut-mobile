import { createContext, ReactNode, useContext, useState } from "react";

interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
}

interface AudioContextType {
  settings: AudioSettings;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>({
    musicVolume: 50,
    sfxVolume: 70,
  });

  const setMusicVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, musicVolume: volume }));
  };

  const setSfxVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, sfxVolume: volume }));
  };

  return (
    <AudioContext.Provider value={{ settings, setMusicVolume, setSfxVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
