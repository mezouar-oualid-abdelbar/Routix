import React, { useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import useActivityStore from "../store/activityStore";
import { AppButton } from "../components/common/AppButton";
import { WeeklyUi } from "../components/schedule-ui/WeeklyUi";
import { IntervalUi } from "../components/schedule-ui/IntervalUi";

const DURATION_UNITS = [
  ["days", "d"],
  ["hours", "h"],
  ["minutes", "m"],
  ["seconds", "s"],
];

// { days: 0, hours: 2, minutes: 30 } -> "2h 30m"
const formatDuration = (data) => {
  if (!data) return "—";
  const parts = DURATION_UNITS.filter(([key]) => Number(data[key]) > 0).map(
    ([key, suffix]) => `${Number(data[key])}${suffix}`,
  );
  return parts.length ? parts.join(" ") : "—";
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return null; // handled as nested rows
  return String(value);
};

const toRows = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    value:
      formatValue(value) ??
      Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", "),
  }));
};

const capitalize = (v) =>
  typeof v === "string" && v ? v.charAt(0).toUpperCase() + v.slice(1) : "—";

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function StepCard({ index, title, onEdit, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{index}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={onEdit} hitSlop={8}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

export function ActivityDetailScreen({ navigation, route }) {
  const { activityId } = route.params ?? {};
  const activity = useActivityStore((state) =>
    state.activities.find((item) => String(item.id) === String(activityId)),
  );
  const softDeleteActivity = useActivityStore(
    (state) => state.softDeleteActivity,
  );

  useEffect(() => {
    if (!activity) navigation.goBack();
  }, [activity, navigation]);

  if (!activity) return null;

  const goEdit = (initialStep) =>
    navigation.navigate("EditActivityScreen", {
      activityId: activity.id,
      initialStep,
    });

  const handleDelete = () => {
    Alert.alert(
      "Delete activity",
      `Delete "${activity.title}"? It will be hidden from your lists.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await softDeleteActivity(activity.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const isWeekly = activity.schedule === "weekly";
  const isInterval = activity.schedule === "interval";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>{activity.title}</Text>
        {activity.status ? (
          <Text style={styles.status}>{capitalize(activity.status)}</Text>
        ) : null}

        <StepCard index={1} title="Info" onEdit={() => goEdit(1)}>
          <Row label="Title" value={activity.title || "—"} />
          <Row label="Description" value={activity.description || "—"} />
          <Row label="Priority" value={capitalize(activity.priority)} />
        </StepCard>

        <StepCard index={2} title="Type" onEdit={() => goEdit(2)}>
          <Row label="Type" value={capitalize(activity.type)} />
          {activity.type === "timed" ? (
            <View style={styles.durationBox}>
              <Text style={styles.durationLabel}>Duration</Text>
              <Text style={styles.durationValue}>
                {formatDuration(activity.typeData)}
              </Text>
            </View>
          ) : (
            toRows(activity.typeData).map((r) => (
              <Row key={r.label} label={r.label} value={r.value} />
            ))
          )}
        </StepCard>

        <StepCard index={3} title="Schedule" onEdit={() => goEdit(3)}>
          <Row label="Schedule" value={capitalize(activity.schedule)} />

          {isWeekly && <WeeklyUi scheduleData={activity.scheduleData} />}
          {isInterval && <IntervalUi scheduleData={activity.scheduleData} />}
          {!isWeekly &&
            !isInterval &&
            toRows(activity.scheduleData).map((r) => (
              <Row key={r.label} label={r.label} value={r.value} />
            ))}

          <Row label="Time" value={formatValue(activity.time) ?? "—"} />
        </StepCard>
      </ScrollView>

      <View style={styles.actionsRow}>
        <AppButton
          title="Edit"
          onPress={() => goEdit(1)}
          variant="secondary"
          style={styles.flex}
        />
        <AppButton
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          style={styles.flex}
        />
      </View>
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
  scrollContent: { paddingBottom: theme.spacing.lg },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  status: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.sm,
  },
  cardTitle: {
    flex: 1,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.md,
  },
  editLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
  },
  row: { marginTop: theme.spacing.sm },
  rowLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
  rowValue: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    marginTop: 2,
  },
  durationBox: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
  },
  durationLabel: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.sm,
  },
  durationValue: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.xl,
  },
  actionsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  flex: { flex: 1 },
});

export default ActivityDetailScreen;