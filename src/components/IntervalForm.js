import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import theme from "../styles/theme";

export function IntervalForm({ scheduleData, setScheduleData }) {
  const intervalDays = scheduleData != null ? String(scheduleData) : "2";

  const handleChangeText = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    setScheduleData(cleanedValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Repeat every</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={intervalDays}
          onChangeText={handleChangeText}
          keyboardType="number-pad"
          maxLength={3}
        />
        <Text style={styles.unit}>{intervalDays === "1" ? "day" : "days"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    width: 70,
    textAlign: "center",
  },
  unit: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
});

export default IntervalForm;
