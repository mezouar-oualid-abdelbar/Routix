import React from "react";
import { View, StyleSheet } from "react-native";
import theme from "../../styles/theme";

export function FormCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
});

export default FormCard;
