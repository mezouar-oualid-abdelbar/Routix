import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../styles/theme";

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

  const handleTaskAction = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.md }}>
          Pending Tasks
        </Text>

        {tasks
          .filter((task) => !task.completed)
          .map((task, index) => {
            // Check if this is the active task with a timer
            const isTimedActive = task.time && index === tasks.filter(t => !t.completed).findIndex(t => t.time);

            return (
              <View
                key={task.id}
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing.sm,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isTimedActive ? theme.colors.primary : theme.colors.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                    {task.title}
                  </Text>

                  {task.time ? (
                    <Text style={{ color: isTimedActive ? theme.colors.primary : theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginTop: theme.spacing.xs, fontWeight: isTimedActive ? "bold" : "normal" }}>
                      {isTimedActive ? `Time Left: ${formatTime(timeLeft)}` : `Duration: ${task.time}s`}
                    </Text>
                  ) : (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginTop: theme.spacing.xs }}>
                      Standard Task
                    </Text>
                  )}
                </View>

                <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
                  <TouchableOpacity
                    onPress={() => handleTaskAction(task.id)}
                    style={{
                      backgroundColor: theme.colors.primary,
                      paddingVertical: theme.spacing.xs,
                      paddingHorizontal: theme.spacing.md,
                      borderRadius: theme.borderRadius.sm,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: theme.colors.textInverse, fontWeight: theme.fontWeights.bold }}>
                      Done
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleTaskAction(task.id)}
                    style={{
                      backgroundColor: theme.colors.border,
                      paddingVertical: theme.spacing.xs,
                      paddingHorizontal: theme.spacing.md,
                      borderRadius: theme.borderRadius.sm,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: theme.colors.textSecondary, fontWeight: theme.fontWeights.bold }}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </View>
    </SafeAreaView>
  );
}