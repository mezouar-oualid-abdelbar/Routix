import React from "react";
import { View, StyleSheet } from "react-native";
import theme from "../../styles/theme";

export function StepDots({ step, total = 4 }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <View key={n} style={[styles.dot, n === step && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
  },
  dotActive: { backgroundColor: theme.colors.primary },
});

export default StepDots;
