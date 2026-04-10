import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/locales';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, setMusicVolume, setSfxVolume } = useAudio();
  const { getEffectiveUILanguage } = useLanguage();
  const language = getEffectiveUILanguage();
  const t = useTranslation(language);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Ionicons name="settings" size={Sizes.icon.md} color={Colors.blue[600]} />
              <Text style={styles.title}>{t.settings.title}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={Sizes.icon.md} color={Colors.gray[600]} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Musique */}
            <View style={styles.setting}>
              <View style={styles.settingHeader}>
                <Ionicons name="musical-notes" size={Sizes.icon.sm} color={Colors.purple[600]} />
                <Text style={styles.settingLabel}>{t.settings.music}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Ionicons name="volume-low" size={Sizes.icon.sm} color={Colors.gray[400]} />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={settings.musicVolume}
                  onValueChange={setMusicVolume}
                  minimumTrackTintColor={Colors.purple[500]}
                  maximumTrackTintColor={Colors.gray[300]}
                  thumbTintColor={Colors.purple[600]}
                />
                <Ionicons name="volume-high" size={Sizes.icon.sm} color={Colors.gray[400]} />
                <Text style={styles.volumeValue}>{Math.round(settings.musicVolume)}%</Text>
              </View>
            </View>

            {/* Effets sonores */}
            <View style={styles.setting}>
              <View style={styles.settingHeader}>
                <Ionicons name="volume-high" size={Sizes.icon.sm} color={Colors.blue[600]} />
                <Text style={styles.settingLabel}>{t.settings.soundEffects}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Ionicons name="volume-low" size={Sizes.icon.sm} color={Colors.gray[400]} />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={settings.sfxVolume}
                  onValueChange={setSfxVolume}
                  minimumTrackTintColor={Colors.blue[500]}
                  maximumTrackTintColor={Colors.gray[300]}
                  thumbTintColor={Colors.blue[600]}
                />
                <Ionicons name="volume-high" size={Sizes.icon.sm} color={Colors.gray[400]} />
                <Text style={styles.volumeValue}>{Math.round(settings.sfxVolume)}%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.borderRadius.xxl,
    borderTopRightRadius: Sizes.borderRadius.xxl,
    paddingTop: Sizes.spacing.lg,
    paddingBottom: Sizes.spacing.xl,
    paddingHorizontal: Sizes.spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.xl,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  title: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  closeButton: {
    padding: Sizes.spacing.sm,
  },
  content: {
    gap: Sizes.spacing.xl,
  },
  setting: {
    gap: Sizes.spacing.md,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  settingLabel: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeValue: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    width: 45,
    textAlign: 'right',
  },
});
