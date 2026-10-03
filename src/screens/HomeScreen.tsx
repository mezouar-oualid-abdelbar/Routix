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
import { StatusBadge } from "../components/common/StatusBadge";
import useActivityStore from "../store/activityStore";
import { sortByPriority, sortByTime } from "../utils/activityFilters";
import {
  getProgressSummary,
} from "../utils/todayEntries";
import { getExecutionRoute } from "../utils/activityNavigation";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

function EntryFooter({ entry }: { entry: any }) {
  const summary = getProgressSummary(entry);
  return (
    <View style={styles.footer}>
      <View style={styles.footerTrack}>
        <View style={[styles.footerFill, { width: `${summary.percent}%` }]} />
      </View>
      {summary.detail ? (
        <Text style={styles.footerDetail}>{summary.detail}</Text>
      ) : null}
    </View>
  );
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const todayEntries = useActivityStore((state: any) => state.todayEntries);
  const refreshToday = useActivityStore((state: any) => state.refreshToday);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<string>("priority");

  useFocusEffect(
    useCallback(() => {
      refreshToday();
    }, [refreshToday]),
  );

  const visibleEntries = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? todayEntries
        : todayEntries.filter((entry: any) => entry.status === statusFilter);
    const compare =
      sortMode === "time"
        ? (a: any, b: any) => sortByTime(a.activity, b.activity)
        : (a: any, b: any) => sortByPriority(a.activity, b.activity);
    return [...filtered].sort(compare);
  }, [todayEntries, statusFilter, sortMode]);

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
        data={visibleEntries}
        keyExtractor={(entry: any) => String(entry.activity.id)}
        renderItem={({ item: entry }) => (
          <ActivityCard
            activity={entry.activity}
            onPress={() => {
              const route = getExecutionRoute(entry.activity);
              navigation.navigate(route.name, route.params);
            }}
            badge={<StatusBadge status={entry.status} />}
            footer={<EntryFooter entry={entry} />}
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
  footer: {
    marginTop: theme.spacing.sm,
  },
  footerTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  footerFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  footerDetail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
});
