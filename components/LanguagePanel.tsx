import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';
import { useLanguage, Language, DictionaryLanguage } from '../contexts/LanguageContext';
import { loadDictionaryFromURL, addCustomDictionaryToCache } from '../utils/dictionary';

interface LanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguagePanel({ isOpen, onClose }: LanguagePanelProps) {
  const {
    uiLanguage,
    setUILanguage,
    getEffectiveUILanguage,
    dictionaryLanguage,
    setDictionaryLanguage,
    customDictionaries,
    addCustomDictionary,
    removeCustomDictionary,
  } = useLanguage();

  const [showAddDictionary, setShowAddDictionary] = useState(false);
  const [dictionaryURL, setDictionaryURL] = useState('');
  const [dictionaryName, setDictionaryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const effectiveUILang = getEffectiveUILanguage();
  const isFrench = effectiveUILang === 'fr';

  const handleAddCustomDictionary = async () => {
    if (!dictionaryURL.trim()) {
      Alert.alert(
        isFrench ? 'Erreur' : 'Error',
        isFrench ? 'Veuillez entrer une URL' : 'Please enter a URL'
      );
      return;
    }

    if (!dictionaryName.trim()) {
      Alert.alert(
        isFrench ? 'Erreur' : 'Error',
        isFrench ? 'Veuillez entrer un nom' : 'Please enter a name'
      );
      return;
    }

    setIsLoading(true);

    try {
      const dictionary = await loadDictionaryFromURL(dictionaryURL);
      const id = `custom-${Date.now()}`;

      addCustomDictionaryToCache(id, dictionary);

      const totalWords = Object.values(dictionary).reduce((sum, set) => sum + set.size, 0);

      await addCustomDictionary({
        id,
        name: dictionaryName,
        words: new Set([totalWords.toString()]),
        source: 'url',
        sourceValue: dictionaryURL,
      });

      setDictionaryURL('');
      setDictionaryName('');
      setShowAddDictionary(false);
      await setDictionaryLanguage(id);
      
      Alert.alert(
        isFrench ? 'Succès' : 'Success',
        isFrench ? 'Dictionnaire ajouté avec succès' : 'Dictionary added successfully'
      );
    } catch (err) {
      console.error('Error loading custom dictionary:', err);
      Alert.alert(
        isFrench ? 'Erreur' : 'Error',
        isFrench
          ? 'Erreur lors du chargement du dictionnaire'
          : 'Error loading dictionary'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDictionary = (id: string, name: string) => {
    Alert.alert(
      isFrench ? 'Supprimer' : 'Delete',
      isFrench ? `Supprimer "${name}" ?` : `Delete "${name}"?`,
      [
        { text: isFrench ? 'Annuler' : 'Cancel', style: 'cancel' },
        {
          text: isFrench ? 'Supprimer' : 'Delete',
          style: 'destructive',
          onPress: () => removeCustomDictionary(id),
        },
      ]
    );
  };

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
              <Ionicons name="language" size={Sizes.icon.md} color={Colors.blue[600]} />
              <Text style={styles.title}>
                {isFrench ? 'Paramètres de langue' : 'Language Settings'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={Sizes.icon.md} color={Colors.gray[600]} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Langue de l'interface */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isFrench ? 'Langue de l\'interface' : 'Interface Language'}
              </Text>
              
              {[
                { value: 'system', label: isFrench ? 'Langue de l\'appareil' : 'Device Language' },
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.option,
                    uiLanguage === option.value && styles.optionSelected,
                  ]}
                  onPress={() => setUILanguage(option.value as Language)}
                >
                  <View style={[
                    styles.radio,
                    uiLanguage === option.value && styles.radioSelected,
                  ]}>
                    {uiLanguage === option.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Dictionnaire de mots */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isFrench ? 'Dictionnaire de mots' : 'Word Dictionary'}
              </Text>

              {/* Dictionnaires intégrés */}
              {[
                { value: 'fr', label: isFrench ? 'Français (336 000 mots)' : 'French (336,000 words)' },
                { value: 'en', label: isFrench ? 'Anglais (370 000 mots)' : 'English (370,000 words)' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.option,
                    dictionaryLanguage === option.value && styles.optionSelected,
                  ]}
                  onPress={() => setDictionaryLanguage(option.value as DictionaryLanguage)}
                >
                  <View style={[
                    styles.radio,
                    dictionaryLanguage === option.value && styles.radioSelected,
                  ]}>
                    {dictionaryLanguage === option.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              ))}

              {/* Dictionnaires personnalisés */}
              {customDictionaries.map((dict) => (
                <View
                  key={dict.id}
                  style={[
                    styles.option,
                    dictionaryLanguage === dict.id && styles.optionSelected,
                  ]}
                >
                  <Pressable
                    style={styles.customDictOption}
                    onPress={() => setDictionaryLanguage(dict.id)}
                  >
                    <View style={[
                      styles.radio,
                      dictionaryLanguage === dict.id && styles.radioSelected,
                    ]}>
                      {dictionaryLanguage === dict.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View style={styles.customDictInfo}>
                      <Text style={styles.optionText}>{dict.name}</Text>
                      <Text style={styles.customDictSource}>{dict.sourceValue}</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => handleRemoveDictionary(dict.id, dict.name)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={Sizes.icon.sm} color={Colors.red[600]} />
                  </Pressable>
                </View>
              ))}

              {/* Bouton ajouter ou formulaire */}
              {!showAddDictionary ? (
                <Pressable
                  style={styles.addButton}
                  onPress={() => setShowAddDictionary(true)}
                >
                  <Ionicons name="add-circle-outline" size={Sizes.icon.sm} color={Colors.purple[600]} />
                  <Text style={styles.addButtonText}>
                    {isFrench ? 'Ajouter un dictionnaire' : 'Add Dictionary'}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.addForm}>
                  <TextInput
                    style={styles.input}
                    placeholder={isFrench ? 'Nom du dictionnaire' : 'Dictionary name'}
                    value={dictionaryName}
                    onChangeText={setDictionaryName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="https://example.com/dictionary.txt"
                    value={dictionaryURL}
                    onChangeText={setDictionaryURL}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                  <View style={styles.formButtons}>
                    <Pressable
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={() => {
                        setShowAddDictionary(false);
                        setDictionaryURL('');
                        setDictionaryName('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>
                        {isFrench ? 'Annuler' : 'Cancel'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.formButton, styles.submitButton]}
                      onPress={handleAddCustomDictionary}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={Colors.white} />
                      ) : (
                        <Text style={styles.submitButtonText}>
                          {isFrench ? 'Ajouter' : 'Add'}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
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
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.lg,
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
    paddingHorizontal: Sizes.spacing.lg,
  },
  section: {
    marginBottom: Sizes.spacing.xl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Sizes.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    marginBottom: Sizes.spacing.sm,
  },
  optionSelected: {
    borderColor: Colors.purple[500],
    backgroundColor: Colors.purple[50],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    marginRight: Sizes.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.purple[600],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.purple[600],
  },
  optionText: {
    fontSize: Sizes.fontSize.base,
    color: Colors.gray[700],
    fontWeight: '500',
  },
  customDictOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customDictInfo: {
    flex: 1,
  },
  customDictSource: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.gray[500],
    marginTop: 2,
  },
  deleteButton: {
    padding: Sizes.spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.sm,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.purple[300],
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: Sizes.fontSize.base,
    color: Colors.purple[600],
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: Colors.purple[50],
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    gap: Sizes.spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    fontSize: Sizes.fontSize.base,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  formButton: {
    flex: 1,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[200],
  },
  cancelButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  submitButton: {
    backgroundColor: Colors.purple[600],
  },
  submitButtonText: {
    fontSize: Sizes.fontSize.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
