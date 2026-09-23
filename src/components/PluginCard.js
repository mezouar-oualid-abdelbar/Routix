import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import theme from "../styles/theme";

export function PluginCard({
  title,
  description,
  version,
  onPress,
  onLongPress,
  footer,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          {version ? <Text style={styles.version}>v{version}</Text> : null}
        </View>

        {description ? <Text style={styles.description}>{description}</Text> : null}

        {footer}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  version: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default PluginCard;
