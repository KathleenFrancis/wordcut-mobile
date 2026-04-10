import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AudioProvider } from "../contexts/AudioContext";
import { LanguageProvider } from "../contexts/LanguageContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Charger des polices personnalisées ici
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AudioProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="game" />
            <Stack.Screen name="rules" />
          </Stack>
        </AudioProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
