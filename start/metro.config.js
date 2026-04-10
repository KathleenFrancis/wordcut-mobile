const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ajouter .txt pour charger les dictionnaires
config.resolver.assetExts.push("txt");

module.exports = config;
