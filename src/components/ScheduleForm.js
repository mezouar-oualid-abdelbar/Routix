import React, { useEffect } from "react";
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
  setScheduleData,
}) {
  // Reset schedule data whenever the schedule type changes
  useEffect(() => {
    setScheduleData(null);
  }, [schedule]);

  const renderScheduleForm = (selectedSchedule, data) => {
    switch (selectedSchedule) {
      case "weekly":
        return (
          <WeeklyForm scheduleData={data} setScheduleData={setScheduleData} />
        );
      case "interval":
        return (
          <IntervalForm scheduleData={data} setScheduleData={setScheduleData} />
        );
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
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  switch: {
    marginBottom: theme.spacing.sm,
  },
});

export default ScheduleForm;
