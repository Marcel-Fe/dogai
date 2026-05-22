// Metro-Konfiguration für DogAI.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @supabase/realtime-js zieht das Node-Paket `ws` nach, das Node-Builtins
// (stream) erwartet. Mit deaktivierter package.json-"exports"-Auflösung
// nimmt Metro stattdessen das `browser`-Feld von `ws` (React-Native-tauglich).
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
