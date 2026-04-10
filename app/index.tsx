import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LanguagePanel } from "../components/LanguagePanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { Colors } from "../constants/Colors";
import { Sizes } from "../constants/Sizes";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../utils/locales";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <>
      <LinearGradient
        colors={["#dbeafe", "#e9d5ff", "#fce7f3"]} //colors={Colors.gradients.primary}
        style={styles.container}
      >
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
                  <Ionicons
                    name="play"
                    size={Sizes.icon.md}
                    color={Colors.white}
                  />
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
                  <Ionicons
                    name="book-outline"
                    size={Sizes.icon.md}
                    color={Colors.gray[700]}
                  />
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
                <Ionicons
                  name="language"
                  size={Sizes.icon.md}
                  color={Colors.white}
                />
                <Text style={styles.accentButtonText}>{t.home.language}</Text>
              </Pressable>
            </Animated.View>

            {/* Bouton Paramètres */}
            <Animated.View entering={FadeInDown.delay(500).springify()}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setIsSettingsOpen(true)}
              >
                <Ionicons
                  name="settings-outline"
                  size={Sizes.icon.md}
                  color={Colors.gray[700]}
                />
                <Text style={styles.secondaryButtonText}>
                  {t.settings.title}
                </Text>
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
    </>
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
    paddingHorizontal: Sizes.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Sizes.spacing.xxl,
  },
  title: {
    fontSize: Sizes.fontSize.massive,
    fontWeight: "bold",
    color: Colors.primary.blue,
    marginBottom: Sizes.spacing.md,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.gray[600],
  },
  menu: {
    width: "100%",
    maxWidth: 400,
    gap: Sizes.spacing.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.spacing.md,
    backgroundColor: Colors.primary.green,
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.xl,
    borderRadius: Sizes.borderRadius.xl,
    ...Sizes.shadow.large,
  },
  primaryButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: "600",
    color: Colors.white,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.spacing.md,
    backgroundColor: Colors.white,
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.xl,
    borderRadius: Sizes.borderRadius.xl,
    ...Sizes.shadow.medium,
  },
  secondaryButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: "600",
    color: Colors.gray[700],
  },
  accentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.spacing.md,
    backgroundColor: Colors.primary.purple,
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.xl,
    borderRadius: Sizes.borderRadius.xl,
    ...Sizes.shadow.medium,
  },
  accentButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: "600",
    color: Colors.white,
  },
  version: {
    marginTop: Sizes.spacing.xxl,
    fontSize: Sizes.fontSize.sm,
    color: Colors.gray[400],
  },
});
