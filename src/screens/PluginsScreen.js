import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import theme from "../styles/theme";
import PluginCard from "../components/PluginCard";
import PluginRunner from "../components/PluginRunner";
import AppButton from "../components/common/AppButton";
import {
  getInstalledPlugins,
  installPlugin,
  removePlugin,
} from "../plugins/installedPlugins";

export default function PluginsScreen() {
  const [plugins, setPlugins] = useState([]);
  const [runningUrl, setRunningUrl] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [installing, setInstalling] = useState(false);
  const [installError, setInstallError] = useState(null);

  const refresh = useCallback(async () => {
    setPlugins(await getInstalledPlugins());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleInstall = async () => {
    if (!urlInput.trim()) return;
    setInstalling(true);
    setInstallError(null);
    try {
      await installPlugin(urlInput.trim());
      setUrlInput("");
      await refresh();
    } catch (error) {
      setInstallError(error.message);
    } finally {
      setInstalling(false);
    }
  };

  const handleRemove = async (sourceUrl) => {
    if (runningUrl === sourceUrl) setRunningUrl(null);
    await removePlugin(sourceUrl);
    await refresh();
  };

  const running = plugins.find((p) => p.sourceUrl === runningUrl) ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Plugins</Text>

      <View style={styles.installRow}>
        <TextInput
          style={styles.input}
          placeholder="github.com/owner/plugin-repo"
          placeholderTextColor={theme.colors.textSecondary}
          value={urlInput}
          onChangeText={setUrlInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AppButton
          title={installing ? "Installing..." : "Install"}
          onPress={handleInstall}
          style={styles.installButton}
        />
      </View>
      {installError ? <Text style={styles.installError}>{installError}</Text> : null}

      <FlatList
        data={plugins}
        keyExtractor={(plugin) => plugin.sourceUrl}
        renderItem={({ item: plugin }) => (
          <PluginCard
            title={plugin.name}
            description={plugin.description}
            version={plugin.version}
            onPress={() =>
              setRunningUrl((current) =>
                current === plugin.sourceUrl ? null : plugin.sourceUrl,
              )
            }
            onLongPress={() => handleRemove(plugin.sourceUrl)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No plugins installed</Text>
        }
      />

      {running ? (
        <View style={styles.runner}>
          <View style={styles.runnerHeaderRow}>
            <Text style={styles.runnerTitle}>{running.name}</Text>
            <TouchableOpacity onPress={() => setRunningUrl(null)} activeOpacity={0.8}>
              <Text style={styles.runnerClose}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Remount per plugin so its code runs again from a clean state. */}
          <PluginRunner key={running.sourceUrl} pluginCode={running.code} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  installRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
  },
  installButton: {
    paddingHorizontal: theme.spacing.md,
  },
  installError: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.sm,
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  runner: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  runnerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  runnerTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  runnerClose: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
  },
});