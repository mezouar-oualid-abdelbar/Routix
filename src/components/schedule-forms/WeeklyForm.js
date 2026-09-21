import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import { WEEK_DAYS } from "../../constants/activity";
import { FormCard } from "../common/FormCard";

export function WeeklyForm({ scheduleData, setScheduleData }) {
  const selectedDays = Array.isArray(scheduleData) ? scheduleData : [];

  const toggleDay = (day) => {
    const isSelected = selectedDays.includes(day);
    const updatedDays = isSelected
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setScheduleData(updatedDays);
  };

  return (
    <FormCard>
      <Text style={styles.label}>Repeat on</Text>

      <View style={styles.dayRow}>
        {WEEK_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <TouchableOpacity
              key={day.value}
              style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[styles.dayText, isSelected && styles.dayTextSelected]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedDays.length === 0 && (
        <Text style={styles.hint}>Select at least one day</Text>
      )}
    </FormCard>
  );
}

const styles = StyleSheet.create({
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

export default WeeklyForm;
