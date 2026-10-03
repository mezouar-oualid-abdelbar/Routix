import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import theme from "../../styles/theme";

type AppButtonVariant = "primary" | "secondary" | "danger" | "muted";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export function AppButton({ title, onPress, variant = "primary", style, textStyle }: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.base, styles[variant], style]}
    >
      <Text style={[styles.baseText, styles[`${variant}Text` as keyof typeof styles], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  muted: {
    backgroundColor: theme.colors.border,
  },
  baseText: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
  },
  primaryText: {
    color: theme.colors.textInverse,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
  dangerText: {
    color: theme.colors.textInverse,
  },
  mutedText: {
    color: theme.colors.textSecondary,
  },
});

export default AppButton;
