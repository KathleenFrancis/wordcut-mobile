import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LanguagePanel } from "../components/LanguagePanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../utils/locales";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <LinearGradient
      colors={["#dbeafe", "#e9d5ff", "#fce7f3"]}
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
                <Text style={styles.primaryButtonText}>
                  {t.home.playButton}
                </Text>
              </Pressable>
            </Link>
          </Animated.View>

          {/* Bouton Règles */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Link href="/rules" asChild>
              <Pressable style={styles.secondaryButton}>
                <Ionicons name="book-outline" size={24} color="#374151" />
                <Text style={styles.secondaryButtonText}>
                  {t.home.rulesButton}
                </Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 56,
    fontWeight: "bold",
    background: "linear-gradient(to right, #2563eb, #9333ea, #ec4899)",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
  },
  menu: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  accentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accentButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  version: {
    marginTop: 48,
    fontSize: 14,
    color: "#9ca3af",
  },
});
