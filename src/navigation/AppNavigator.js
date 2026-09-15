import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../styles/theme";

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

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
 
  if (currentIndex >= tasks.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center", padding: theme.spacing.xl }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.md }}>
          Workout Complete! 🎉
        </Text>
        <TouchableOpacity
          onPress={() => {
            setCurrentIndex(0);
            setTasks(initialTasks);
          }}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Text style={{ color: theme.colors.textInverse, fontWeight: theme.fontWeights.bold, fontSize: theme.fontSizes.md }}>
            Restart
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg }}> 

      <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
        Task {currentIndex + 1} of {tasks.length}
      </Text>
 
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, textAlign: "center", marginBottom: theme.spacing.xl }}>
          {currentTask.title}
        </Text>

        {currentTask.time ? (
          <View style={{ alignItems: "center", marginBottom: theme.spacing.xxl }}>
            <Text style={{ color: theme.colors.primary, fontSize: 64, fontWeight: theme.fontWeights.bold, fontVariant: ["tabular-nums"] }}>
              {formatTime(timeLeft)}
            </Text>

            {timeIsUp && (
              <Text style={{ color: theme.colors.error, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold, marginTop: theme.spacing.md }}>
                Time is up!
              </Text>
            )}
          </View>
        ) : (
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.md, marginBottom: theme.spacing.xxl }}>
            Standard Activity
          </Text>
        )}
      </View>
 
      <View style={{ flexDirection: "row", gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        {currentTask.time ? (
          timeIsUp ? ( 
            <TouchableOpacity
              onPress={handleNextTask}
              style={{
                flex: 1,
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.colors.textInverse, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                Next
              </Text>
            </TouchableOpacity>
          ) : ( 
            <>
              <TouchableOpacity
                onPress={() => setIsRunning(!isRunning)}
                style={{
                  flex: 1,
                  backgroundColor: isRunning ? theme.colors.error : theme.colors.primary,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.textInverse, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                  {isRunning ? "Pause" : "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextTask}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                  Skip
                </Text>
              </TouchableOpacity>
            </>
          )
        ) : ( 
          <>
            <TouchableOpacity
              onPress={handleNextTask}
              style={{
                flex: 1,
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.colors.textInverse, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                Done
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextTask}
              style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                Skip
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}