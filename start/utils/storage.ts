import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Pour données sensibles (optionnel dans ce cas)
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// Pour données générales
export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
