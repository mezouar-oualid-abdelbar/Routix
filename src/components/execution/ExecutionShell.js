import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../styles/theme";
import { LOG_STATUS } from "../../constants/logStatus";

const STATUS_COLORS = {
  [LOG_STATUS.PENDING]: theme.colors.textSecondary,
  [LOG_STATUS.IN_PROGRESS]: theme.colors.info,
  [LOG_STATUS.COMPLETED]: theme.colors.success,
};

const STATUS_LABELS = {
  [LOG_STATUS.PENDING]: "Pending",
  [LOG_STATUS.IN_PROGRESS]: "In Progress",
  [LOG_STATUS.COMPLETED]: "Completed",
};

// Shared header (title + progress bar + status) for type execution screens.
export function ExecutionShell({ title, subtitle, status, progress, children }) {
  const clamped = Math.max(0, Math.min(100, progress ?? 0));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${clamped}%` }]} />
        </View>
        <Text style={[styles.statusText, { color: STATUS_COLORS[status] ?? STATUS_COLORS[LOG_STATUS.PENDING] }]}>
          {STATUS_LABELS[status] ?? status} • {clamped}%
        </Text>
      </View>

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  progressRow: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
});

export default ExecutionShell;
