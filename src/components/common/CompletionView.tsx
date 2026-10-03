import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../styles/theme";
import { AppButton } from "./AppButton";

interface CompletionViewProps {
  title: string;
  buttonLabel: string;
  onPress: () => void;
}

export function CompletionView({ title, buttonLabel, onPress }: CompletionViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <AppButton
        title={buttonLabel}
        onPress={onPress}
        style={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
  },
});

export default CompletionView;
