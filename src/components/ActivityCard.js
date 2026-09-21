import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import theme from "../styles/theme";

import WeeklyUi from "./schedule-ui/WeeklyUi";
import IntervalUi from "./schedule-ui/IntervalUi";

const renderScheduleUi = (schedule, scheduleData) => {
  switch (schedule) {
    case "weekly":
      return <WeeklyUi scheduleData={scheduleData} />;

    case "interval":
      return <IntervalUi scheduleData={scheduleData} />;

    default:
      return null;
  }
};

export function ActivityCard({ activity, onPress, onLongPress, footer }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Activity title */}
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.title}>{activity.schedule}</Text>
        {/* Schedule */}
        {renderScheduleUi(activity.schedule, activity.scheduleData)}
        {footer}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
});

export default ActivityCard;
