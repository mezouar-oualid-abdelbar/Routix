import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import theme from "../styles/theme";
import { AppSwitch } from "./common/AppSwitch";

export function InfoForm({
  title,
  setTitle,
  discribtion,
  setDiscribtion,
  switchPriority = [],
  priority,
  setPriority,
}) {
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
      <AppSwitch
        options={switchPriority}
        value={priority}
        onPress={(value) => setPriority(value)}
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
