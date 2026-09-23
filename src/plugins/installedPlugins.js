import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchPlugin } from "./pluginInstaller";

const STORAGE_KEY = "routix.installedPlugins";

async function readAll() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeAll(plugins) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
}

export async function getInstalledPlugins() {
  return readAll();
}

// Fetches the plugin from GitHub, then saves it to the on-device list.
// Throws if the URL is bad or the plugin is already installed.
export async function installPlugin(githubUrl) {
  const plugin = await fetchPlugin(githubUrl);
  const existing = await readAll();

  if (existing.some((p) => p.sourceUrl === plugin.sourceUrl)) {
    throw new Error("This plugin is already installed");
  }

  const entry = { ...plugin, installedAt: new Date().toISOString() };
  await writeAll([...existing, entry]);
  return entry;
}

export async function removePlugin(sourceUrl) {
  const existing = await readAll();
  await writeAll(existing.filter((p) => p.sourceUrl !== sourceUrl));
}