import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { formatCountdown } from "../utils/formatTime";

const initialTasks = [
    { id: "1", title: "task 1", time: 15, completed: false }, // stored as numeric seconds
    { id: "2", title: "task 2", time: 30, completed: false },
    { id: "3", title: "task 3", completed: false }, // Standard task (no time property)
];

export default function MultiActivityScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  // Find the first active task that has a time requirement
  const currentTimedTask = tasks.find((task) => !task.completed && task.time);

  const [timeLeft, setTimeLeft] = useState(currentTimedTask ? currentTimedTask.time : 0);
  const [isRunning, setIsRunning] = useState(true);

  const handleTaskAction = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  // Sync timeLeft whenever the active task changes
  useEffect(() => {
    if (currentTimedTask) {
      setTimeLeft(currentTimedTask.time);
      setIsRunning(true);
    }
  }, [currentTimedTask?.id]);

  // =========================
  // COUNTDOWN FOR TIMED TASKS
  // =========================
  useEffect(() => {
    if (!currentTimedTask || !isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          // Auto-complete the timed task when time is up
          handleTaskAction(currentTimedTask.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTimedTask, isRunning]);

  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>
          Pending Tasks
        </Text>

        {pendingTasks.map((task, index) => {
          // Check if this is the active task with a timer
          const isTimedActive = task.time && index === pendingTasks.findIndex(t => t.time);

          return (
            <View
              key={task.id}
              style={[
                styles.taskRow,
                isTimedActive && styles.taskRowActive,
              ]}
            >
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>
                  {task.title}
                </Text>

                {task.time ? (
                  <Text style={[styles.taskTime, isTimedActive && styles.taskTimeActive]}>
                    {isTimedActive ? `Time Left: ${formatCountdown(timeLeft)}` : `Duration: ${task.time}s`}
                  </Text>
                ) : (
                  <Text style={styles.taskStandard}>
                    Standard Task
                  </Text>
                )}
              </View>

              <View style={styles.taskActions}>
                <AppButton
                  title="Done"
                  onPress={() => handleTaskAction(task.id)}
                  style={styles.smallButton}
                />
                <AppButton
                  title="Skip"
                  onPress={() => handleTaskAction(task.id)}
                  variant="muted"
                  style={styles.smallButton}
                />
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  taskRow: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  taskRowActive: {
    borderColor: theme.colors.primary,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
  },
  taskTime: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  taskTimeActive: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  taskStandard: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  taskActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0,
  },
});
