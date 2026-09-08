import React from "react";
import { Text, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import WeeklyForm from "../components/WeeklyForm";
import IntervalForm from "../components/IntervalForm";
import theme from "../styles/theme";

export function ScheduleForm({
  schedule,
  switchSchedule,
  setSchedule,
  scheduleData,
}) {
  const renderScheduleForm = (selectedSchedule, data) => {
    switch (selectedSchedule) {
      case "weekly":
        return <WeeklyForm scheduleData={data} />;
      case "interval":
        return <IntervalForm scheduleData={data} />;
      default:
        return null;
    }
  };

  const initialScheduleIndex = Math.max(
    0,
    switchSchedule
      ? switchSchedule.findIndex((item) => item.value === schedule)
      : 0,
  );

  return (
    <>
      <Text style={styles.header}>Schedule</Text>
      <SwitchSelector
        options={switchSchedule}
        initial={initialScheduleIndex}
        onPress={(value) => setSchedule(value)}
        buttonColor={theme.colors.primary}
        backgroundColor={theme.colors.surface}
        textColor={theme.colors.textSecondary}
        selectedTextStyle={{ color: theme.colors.textInverse }}
        style={styles.switch}
      />

      {renderScheduleForm(schedule, scheduleData)}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  dotsRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
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
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  timeButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  timeButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  reviewHeader: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reviewRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  reviewLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  reviewValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginTop: 2,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  nextButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.md,
  },
});
