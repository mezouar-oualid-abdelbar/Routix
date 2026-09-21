import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";
import { ExecutionShell } from "../components/execution/ExecutionShell";
import useActivityStore from "../store/activityStore";
import { useActivityLog } from "../hooks/useActivityLog";
import { useTaskTimer } from "../hooks/useTaskTimer";
import { todayKey } from "../utils/dates";
import { LOG_STATUS } from "../constants/logStatus";
import { formatCountdown, formatDuration } from "../utils/formatTime";

const DEFAULT_DURATION = { hours: 1, minutes: 0 };

export default function TimedActivityScreen({ navigation, route }) {
  const { activityId } = route?.params ?? {};
  const activity = useActivityStore((state) =>
    activityId == null
      ? undefined
      : state.activities.find((item) => String(item.id) === String(activityId)),
  );

  const { log, loading, start, saveProgress, complete } = useActivityLog(
    activity?.id,
    todayKey(),
  );
  const { timeLeft, isRunning, start: startTimer, pause: pauseTimer, reset } =
    useTaskTimer();

  const totalSeconds = useMemo(() => {
    const duration = activity?.typeData ?? DEFAULT_DURATION;
    return (
      (duration.hours ?? 0) * 3600 + (duration.minutes ?? 0) * 60 ||
      30 * 60
    );
  }, [activity]);

  const [hydrated, setHydrated] = useState(false);

  // Resume persisted progress once the log has loaded.
  useEffect(() => {
    if (!loading && log && !hydrated) {
      reset(totalSeconds - (log.data?.elapsedSeconds ?? 0));
      setHydrated(true);
    }
  }, [loading, log, hydrated, totalSeconds, reset]);

  const persistElapsed = (secondsLeft) => {
    const elapsed = totalSeconds - secondsLeft;
    const progress = Math.min(
      100,
      Math.round((elapsed / totalSeconds) * 100),
    );
    return saveProgress(progress, { totalSeconds, elapsedSeconds: elapsed });
  };

  if (!activity) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Activity not found.</Text>
        <AppButton title="Back" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    );
  }

  if (!loading && log?.status === LOG_STATUS.COMPLETED) {
    return (
      <CompletionView
        title="Timer Complete! 🎉"
        buttonLabel="Back"
        onPress={() => navigation.goBack()}
      />
    );
  }

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      start();
      startTimer({
        onPersist: persistElapsed,
        onFinish: () =>
          complete({ totalSeconds, elapsedSeconds: totalSeconds }),
      });
    }
  };

  const handleComplete = () => {
    pauseTimer();
    complete({ totalSeconds, elapsedSeconds: totalSeconds - timeLeft });
  };

  const isStarted = log?.status === LOG_STATUS.IN_PROGRESS;

  return (
    <ExecutionShell
      title={activity.title}
      subtitle={`Timed • ${formatDuration(activity.typeData ?? DEFAULT_DURATION)}`}
      status={log?.status ?? LOG_STATUS.PENDING}
      progress={log?.progress ?? 0}
    >
      <View style={styles.center}>
        <Text style={styles.timerText}>{formatCountdown(timeLeft)}</Text>
        {loading ? (
          <Text style={styles.hint}>Loading…</Text>
        ) : (
          <Text style={styles.hint}>
            {isStarted ? "Timer running from saved progress." : "Start the timer to begin."}
          </Text>
        )}
      </View>

      <View style={styles.controlsRow}>
        <AppButton
          title={isRunning ? "Pause" : "Start"}
          onPress={handleStartPause}
          variant={isRunning ? "danger" : "primary"}
          style={styles.flex}
        />
        <AppButton title="Complete" onPress={handleComplete} style={styles.flex} />
      </View>

      <AppButton title="Back" onPress={() => navigation.goBack()} variant="secondary" />
    </ExecutionShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  fallbackText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    color: theme.colors.primary,
    fontSize: 64,
    fontWeight: theme.fontWeights.bold,
    fontVariant: ["tabular-nums"],
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  flex: {
    flex: 1,
  },
});
