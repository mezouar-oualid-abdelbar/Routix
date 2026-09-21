import React, { useEffect, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import WeeklyForm from "./schedule-forms/WeeklyForm";
import IntervalForm from "./schedule-forms/IntervalForm";
import theme from "../styles/theme";
import { AppSwitch } from "./common/AppSwitch";

export function ScheduleForm({
  schedule,
  switchSchedule,
  setSchedule,
  scheduleData,
  setScheduleData,
}) {
  // Reset schedule data whenever the schedule type changes
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial mount so prefilled data (edit flow) is preserved.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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

  return (
    <>
      <Text style={styles.header}>Schedule</Text>
      <AppSwitch
        options={switchSchedule}
        value={schedule}
        onPress={(value) => setSchedule(value)}
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
