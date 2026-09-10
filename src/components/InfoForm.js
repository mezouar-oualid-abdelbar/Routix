import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import theme from "../styles/theme";

export function InfoForm({
  title,
  setTitle,
  discribtion,
  setDiscribtion,
  switchPriority = [],
  priority,
  setPriority,
}) {
  // Find initial index matching current priority value
  const initialPriorityIndex = switchPriority.findIndex(
    (item) => item.value === priority,
  );

  return (
    <>
      <Text style={styles.header}>info</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Activity title"
        placeholderTextColor={theme.colors.textSecondary}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={discribtion}
        onChangeText={setDiscribtion}
        placeholder="Activity description"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
      />
      <Text style={styles.label}>Priority</Text>
      <SwitchSelector
        options={switchPriority}
        initial={initialPriorityIndex >= 0 ? initialPriorityIndex : 0}
        onPress={(value) => setPriority(value)}
        buttonColor={theme.colors.primary}
        backgroundColor={theme.colors.surface}
        textColor={theme.colors.textSecondary}
        selectedTextStyle={{ color: theme.colors.textInverse }}
        style={styles.switch}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  switch: {
    marginBottom: theme.spacing.sm,
  },
});
