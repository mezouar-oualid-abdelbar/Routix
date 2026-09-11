import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

export function IntervalUi({ scheduleData }) {
  const intervalDays =
    scheduleData != null && scheduleData !== "" ? String(scheduleData) : "2";

  const unit = intervalDays === "1" ? "day" : "days";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="repeat-outline"
            size={20}
            color={theme.colors.primary}
          />
        </View>

        <View>
          <Text style={styles.label}>Repeat interval</Text>
          <Text style={styles.description}>
            Automatically repeat this activity
          </Text>
        </View>
      </View>

      {/* Interval */}
      <View style={styles.intervalCard}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{intervalDays}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.every}>Every</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,

    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,

    backgroundColor: theme.colors.background,

    alignItems: "center",
    justifyContent: "center",

    marginRight: theme.spacing.sm,
  },

  label: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
  },

  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.xs,
    marginTop: 2,
  },

  intervalCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: theme.colors.background,

    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,

    padding: theme.spacing.md,
  },

  numberContainer: {
    width: 64,
    height: 64,

    borderRadius: theme.borderRadius.md,

    backgroundColor: theme.colors.primary,

    alignItems: "center",
    justifyContent: "center",

    marginRight: theme.spacing.md,
  },

  number: {
    color: theme.colors.background,
    fontSize: 28,
    fontWeight: theme.fontWeights.bold,
  },

  textContainer: {
    justifyContent: "center",
  },

  every: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },

  unit: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginTop: 2,
  },
});

export default IntervalUi;
