import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";
import { formatCountdown } from "../utils/formatTime";

const initialTasks = [
    { id: "1", title: "Warmup Stretch", time: 15, completed: false },
    { id: "2", title: "Review Code Notes", completed: false }, // Standard task
    { id: "3", title: "Pushups", time: 30, completed: false },
];

export default function TimedActivityScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTask = tasks[currentIndex];
  const [timeLeft, setTimeLeft] = useState(currentTask?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);

  useEffect(() => {
    if (currentTask) {
      if (currentTask.time) {
        setTimeLeft(currentTask.time);
        setIsRunning(false);
        setTimeIsUp(false);
      } else {
        setTimeLeft(0);
        setIsRunning(false);
        setTimeIsUp(false);
      }
    }
  }, [currentIndex, currentTask]);

  useEffect(() => {
    if (!isRunning || !currentTask?.time || timeIsUp) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setTimeIsUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentTask, timeIsUp]);

  const handleNextTask = () => {
    setIsRunning(false);
    setTimeIsUp(false);
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(tasks.length);
    }
  };

  if (currentIndex >= tasks.length) {
    return (
      <CompletionView
        title="Workout Complete! 🎉"
        buttonLabel="Restart"
        onPress={() => {
          setCurrentIndex(0);
          setTasks(initialTasks);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.counter}>
        Task {currentIndex + 1} of {tasks.length}
      </Text>

      <View style={styles.center}>
        <Text style={styles.taskTitle}>
          {currentTask.title}
        </Text>

        {currentTask.time ? (
          <View style={styles.timerBlock}>
            <Text style={styles.timerText}>
              {formatCountdown(timeLeft)}
            </Text>

            {timeIsUp && (
              <Text style={styles.timeUpText}>
                Time is up!
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.standardLabel}>
            Standard Activity
          </Text>
        )}
      </View>

      <View style={styles.controlsRow}>
        {currentTask.time ? (
          timeIsUp ? (
            <AppButton
              title="Next"
              onPress={handleNextTask}
              style={styles.flex}
            />
          ) : (
            <>
              <AppButton
                title={isRunning ? "Pause" : "Start"}
                onPress={() => setIsRunning(!isRunning)}
                variant={isRunning ? "danger" : "primary"}
                style={styles.flex}
              />
              <AppButton
                title="Skip"
                onPress={handleNextTask}
                variant="secondary"
                style={styles.flex}
              />
            </>
          )
        ) : (
          <>
            <AppButton
              title="Done"
              onPress={handleNextTask}
              style={styles.flex}
            />
            <AppButton
              title="Skip"
              onPress={handleNextTask}
              variant="secondary"
              style={styles.flex}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  counter: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.sm,
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
    marginBottom: theme.spacing.xl,
  },
  timerBlock: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  timerText: {
    color: theme.colors.primary,
    fontSize: 64,
    fontWeight: theme.fontWeights.bold,
    fontVariant: ["tabular-nums"],
  },
  timeUpText: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing.md,
  },
  standardLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.xxl,
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
