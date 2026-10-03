import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import theme from "../styles/theme";

import WeeklyUi from "./schedule-ui/WeeklyUi";
import IntervalUi from "./schedule-ui/IntervalUi";

const renderScheduleUi = (schedule: string, scheduleData: any) => {
  switch (schedule) {
    case "weekly":
      return <WeeklyUi scheduleData={scheduleData} />;

    case "interval":
      return <IntervalUi scheduleData={scheduleData} />;

    default:
      return null;
  }
};

interface ActivityCardProps {
  activity: any;
  onPress?: () => void;
  onLongPress?: () => void;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  showSchedule?: boolean;
  compact?: boolean;
}

export function ActivityCard({
  activity,
  onPress,
  onLongPress,
  footer,
  badge,
  showSchedule = true,
  compact = false,
}: ActivityCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={[styles.card, compact && styles.compactCard]}>
        {/* Activity title with optional status badge */}
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, compact && styles.compactTitle]}
            numberOfLines={compact ? 1 : undefined}
          >
            {activity.title}
          </Text>
          {badge ? <View style={styles.badgeSlot}>{badge}</View> : null}
        </View>
        {/* Schedule */}
        {showSchedule && !compact
          ? renderScheduleUi(activity.schedule, activity.scheduleData)
          : null}
        {!compact && footer ? footer : null}
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
  compactCard: {
    padding: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  title: {
    flexShrink: 1,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  compactTitle: {
    fontSize: theme.fontSizes.sm,
  },
  badgeSlot: {
    flexShrink: 0,
  },
});

export default ActivityCard;
