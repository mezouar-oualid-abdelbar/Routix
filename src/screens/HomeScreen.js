import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import theme from "../styles/theme";
import ActivityCard from "../components/ActivityCard";
import useActivityStore from "../store/activityStore";
import {
  isDueToday,
  sortByPriority,
  sortByTime,
} from "../utils/activityFilters";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const navigateToTypeScreen = (navigation, activity) => {
  switch (activity.type) {
    case "multi_activities":
      navigation.navigate("MultiActivityScreen", { activityId: activity.id });
      break;
    case "timed":
      navigation.navigate("TimedActivityScreen", { activityId: activity.id });
      break;
    case "follow_up":
      navigation.navigate("FollowUpActivityScreen", { activityId: activity.id });
      break;
    case "normal":
    default:
      navigation.navigate("NormalActivityScreen", {
        activityId: activity.id,
        activityTitle: activity.title,
      });
      break;
  }
};

export default function HomeScreen({ navigation }) {
  const activities = useActivityStore((state) => state.activities);
  const loadActivities = useActivityStore((state) => state.loadActivities);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("priority");

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities]),
  );

  const todayActivities = useMemo(() => {
    const dueToday = activities.filter((activity) => isDueToday(activity));
    const filtered =
      statusFilter === "all"
        ? dueToday
        : dueToday.filter(
            (activity) => (activity.status ?? "pending") === statusFilter,
          );
    return [...filtered].sort(
      sortMode === "time" ? sortByTime : sortByPriority,
    );
  }, [activities, statusFilter, sortMode]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Today</Text>

      <View style={styles.statusRow}>
        {STATUS_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.chip,
              statusFilter === filter.value && styles.chipActive,
            ]}
            onPress={() => setStatusFilter(filter.value)}
          >
            <Text
              style={[
                styles.chipText,
                statusFilter === filter.value && styles.chipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortButton, sortMode === "priority" && styles.sortButtonActive]}
          onPress={() => setSortMode("priority")}
        >
          <Text
            style={[styles.sortText, sortMode === "priority" && styles.sortTextActive]}
          >
            Priority
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortMode === "time" && styles.sortButtonActive]}
          onPress={() => setSortMode("time")}
        >
          <Text style={[styles.sortText, sortMode === "time" && styles.sortTextActive]}>
            Time
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todayActivities}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => navigateToTypeScreen(navigation, item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No activities for today</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
  chipTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
  },
  sortRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sortButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
  },
  sortTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
});
