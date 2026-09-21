import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
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

function taskTotalSeconds(task) {
  const d = task.duration ?? {};
  return (
    (d.hours ?? 0) * 3600 + (d.minutes ?? 0) * 60 + (d.seconds ?? 0)
  );
}

function MultiTaskRow({
  task,
  elapsed,
  running,
  done,
  onStart,
  onTimerPause,
  onDone,
}) {
  const timed = task.type === "timed";
  const totalSeconds = taskTotalSeconds(task);
  const { timeLeft, isRunning, start, pause, reset } = useTaskTimer();

  // Hydrate from today's log whenever it changes and the timer is idle.
  useEffect(() => {
    if (!running) reset(Math.max(totalSeconds - elapsed, 0));
  }, [elapsed, totalSeconds, running, reset]);

  // Parent owns which task runs; follow the `running` flag.
  useEffect(() => {
    if (running && !isRunning) {
      start({
        onPersist: (secondsLeft) =>
          onTimerPause(task.id, totalSeconds - secondsLeft),
        onFinish: () => onTimerPause(task.id, totalSeconds),
      });
    } else if (!running && isRunning) {
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleToggle = () => {
    if (running) onTimerPause(task.id, totalSeconds - timeLeft);
    onStart(running ? null : task.id);
  };

  const handleDone = () => {
    pause();
    onDone(task.id, totalSeconds - timeLeft);
  };

  return (
    <View style={[styles.taskRow, done && styles.taskDone]}>
      <Ionicons
        name={done ? "checkmark-circle" : timed ? "time-outline" : "ellipse-outline"}
        size={20}
        color={done ? theme.colors.primary : theme.colors.textSecondary}
      />
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, done && styles.taskTitleDone]}>
          {task.title}
        </Text>
        {timed && task.duration ? (
          <Text style={styles.taskDuration}>
            {running || timeLeft < totalSeconds
              ? formatCountdown(timeLeft)
              : formatDuration(task.duration)}
          </Text>
        ) : null}
      </View>
      {!done && timed && totalSeconds > 0 && (
        <AppButton
          title={running ? "Pause" : "Start"}
          onPress={handleToggle}
          variant={running ? "danger" : "secondary"}
          style={styles.smallButton}
        />
      )}
      {!done && (
        <AppButton title="Done" onPress={handleDone} style={styles.smallButton} />
      )}
    </View>
  );
}

export default function MultiActivityScreen({ navigation, route }) {
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
  const [activeTaskId, setActiveTaskId] = useState(null);

  const tasks = Array.isArray(activity?.typeData) ? activity.typeData : [];
  const completedIds = log?.data?.completedTaskIds ?? [];
  const timers = log?.data?.timers ?? {};

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
        title="All Tasks Completed! 🎉"
        buttonLabel="Back"
        onPress={() => navigation.goBack()}
      />
    );
  }

  const progressFor = (doneIds) =>
    tasks.length > 0 ? Math.round((doneIds.length / tasks.length) * 100) : 100;

  const handleTimerPause = (taskId, elapsedSeconds) => {
    saveProgress(progressFor(completedIds), {
      completedTaskIds: completedIds,
      timers: { ...timers, [taskId]: elapsedSeconds },
    });
  };

  const handleDoneTask = (taskId, elapsedSeconds) => {
    if (activeTaskId === taskId) setActiveTaskId(null);
    const updated = [...completedIds, taskId];
    const data = {
      completedTaskIds: updated,
      timers: { ...timers, [taskId]: elapsedSeconds },
    };
    if (updated.length >= tasks.length) {
      complete(data);
    } else {
      saveProgress(progressFor(updated), data);
    }
  };

  return (
    <ExecutionShell
      title={activity.title}
      subtitle={`Multi activities • ${completedIds.length} / ${tasks.length} tasks`}
      status={log?.status ?? LOG_STATUS.PENDING}
      progress={log?.progress ?? 0}
    >
      {loading ? (
        <View style={styles.center}>
          <Text style={styles.hint}>Loading…</Text>
        </View>
      ) : log?.status === LOG_STATUS.PENDING ? (
        <View style={styles.center}>
          <Text style={styles.hint}>
            Complete each task below. Your progress is saved automatically.
          </Text>
          <AppButton title="Start" onPress={() => start()} style={styles.startButton} />
        </View>
      ) : (
        <View style={styles.list}>
          {tasks.map((task) => (
            <MultiTaskRow
              key={task.id}
              task={task}
              elapsed={timers[task.id] ?? 0}
              running={activeTaskId === task.id && !completedIds.includes(task.id)}
              done={completedIds.includes(task.id)}
              onStart={setActiveTaskId}
              onTimerPause={handleTimerPause}
              onDone={handleDoneTask}
            />
          ))}
        </View>
      )}

      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.backButton}
      />
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
    gap: theme.spacing.md,
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  startButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  list: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  taskDone: {
    opacity: 0.6,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  taskDuration: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});
