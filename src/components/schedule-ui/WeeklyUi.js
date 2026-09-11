import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../styles/theme";

const DAYS = [
  { label: "S", value: "sunday" },
  { label: "M", value: "monday" },
  { label: "T", value: "tuesday" },
  { label: "W", value: "wednesday" },
  { label: "T", value: "thursday" },
  { label: "F", value: "friday" },
  { label: "S", value: "saturday" },
];

export function WeeklyUi({ scheduleData }) {
  const selectedDays = Array.isArray(scheduleData) ? scheduleData : [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Repeat on</Text>

      <View style={styles.dayRow}>
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);

          return (
            <View
              key={day.value}
              style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
            >
              <Text
                style={[styles.dayText, isSelected && styles.dayTextSelected]}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>

      {selectedDays.length === 0 && (
        <Text style={styles.hint}>Select at least one day</Text>
      )}
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

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircleSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  dayText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
  },

  dayTextSelected: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
  },

  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.xs,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
  },
});

export default WeeklyUi;
