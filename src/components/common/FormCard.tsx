import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import theme from "../../styles/theme";

interface FormCardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function FormCard({ children, style }: FormCardProps) {
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
