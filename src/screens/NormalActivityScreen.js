import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";
import { ExecutionShell } from "../components/execution/ExecutionShell";
import useActivityStore from "../store/activityStore";
import { useActivityLog } from "../hooks/useActivityLog";
import { todayKey } from "../utils/dates";
import { LOG_STATUS } from "../constants/logStatus";

export default function NormalActivityScreen({ navigation, route }) {
  const { activityId, activityTitle } = route?.params ?? {};
  const storedActivity = useActivityStore((state) =>
    activityId == null
      ? undefined
      : state.activities.find((item) => String(item.id) === String(activityId)),
  );
  const title = storedActivity?.title ?? activityTitle ?? "Activity";

  const { log, loading, start, complete } = useActivityLog(
    storedActivity?.id,
    todayKey(),
  );

  const handleComplete = () => {
    complete();
  };

  // Graceful fallback when opened without a stored activity: static view.
  if (!storedActivity) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.standardLabel}>Standard Activity</Text>
        <View style={styles.controlsRow}>
          <AppButton title="Back" onPress={() => navigation.goBack()} variant="secondary" style={styles.flex} />
        </View>
      </View>
    );
  }

  if (!loading && log?.status === LOG_STATUS.COMPLETED) {
    return (
      <CompletionView
        title="Activity Complete! 🎉"
        buttonLabel="Back"
        onPress={() => navigation.goBack()}
      />
    );
  }

  const isStarted = log?.status === LOG_STATUS.IN_PROGRESS;

  return (
    <ExecutionShell
      title={title}
      subtitle="Standard Activity"
      status={log?.status ?? LOG_STATUS.PENDING}
      progress={log?.progress ?? 0}
    >
      <View style={styles.center}>
        {loading ? (
          <Text style={styles.standardLabel}>Loading…</Text>
        ) : (
          <Text style={styles.hint}>
            {isStarted
              ? "Activity in progress. Complete it when you're done."
              : "Start the activity, then mark it completed."}
          </Text>
        )}
      </View>

      <View style={styles.controlsRow}>
        {isStarted ? (
          <AppButton title="Complete" onPress={handleComplete} style={styles.flex} />
        ) : (
          <AppButton title="Start" onPress={() => start()} style={styles.flex} />
        )}
        <AppButton
          title="Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.flex}
        />
      </View>
    </ExecutionShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  standardLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  controlsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  flex: {
    flex: 1,
  },
});
