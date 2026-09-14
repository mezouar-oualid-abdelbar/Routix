import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimerPickerModal } from "react-native-timer-picker";

import theme from "../styles/theme";

export default function TimedActivityScreen() {
  // Start with 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);

  const [isRunning, setIsRunning] = useState(true);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // =========================
  // COUNTDOWN
  // =========================
  useEffect(() => {
    if (!isRunning || timeIsUp) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setTimeIsUp(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeIsUp]);

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================
  // PAUSE / RESUME
  // =========================
  const togglePause = () => {
    if (timeIsUp) return;

    setIsRunning((prev) => !prev);
  };

  // =========================
  // CANCEL
  // =========================
  const cancelTimer = () => {
    setIsRunning(false);
    setTimeIsUp(true);
  };

  // =========================
  // ADD TIME
  // =========================
  const handleAddTime = (duration) => {
    const additionalSeconds =
      (duration.hours || 0) * 3600 +
      (duration.minutes || 0) * 60 +
      (duration.seconds || 0);

    if (additionalSeconds <= 0) {
      setModalVisible(false);
      return;
    }

    setTimeLeft((prev) => prev + additionalSeconds);

    setTimeIsUp(false);
    setIsRunning(true);
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: theme.spacing.md,
        }}
      >
        {!timeIsUp ? (
          <>
            {/* =========================
                COUNTDOWN DISPLAY
            ========================= */}
            <View
              style={{
                width: 260,
                height: 150,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.surface,
                justifyContent: "center",
                alignItems: "center",

                // Subtle border
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: theme.fontSizes.xxl * 2,
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>

            {/* Status */}
            <Text
              style={{
                marginTop: theme.spacing.sm,
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.medium,
                color: theme.colors.textSecondary,
              }}
            >
              {isRunning ? "Running" : "Paused"}
            </Text>

            {/* =========================
                BUTTONS
            ========================= */}
            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.sm,
                marginTop: theme.spacing.lg,
              }}
            >
              {/* Pause / Resume */}
              <TouchableOpacity
                onPress={togglePause}
                activeOpacity={0.8}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.textInverse,
                    fontSize: theme.fontSizes.md,
                    fontWeight: theme.fontWeights.bold,
                  }}
                >
                  {isRunning ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                onPress={(cancelTimer)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.error,
                    fontSize: theme.fontSizes.md,
                    fontWeight: theme.fontWeights.bold,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* =========================
             TIME IS UP
          ========================= */
          <>
            <Text
              style={{
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              Your activity time ended
            </Text>

            {/* Add Some Time */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color: theme.colors.textInverse,
                  fontSize: theme.fontSizes.md,
                  fontWeight: theme.fontWeights.bold,
                }}
              >
                Add Some Time
              </Text>
            </TouchableOpacity>

            {/* Finish */}
            <TouchableOpacity
              onPress={() => {
                setTimeLeft(0);
                setTimeIsUp(true);
                setIsRunning(false);
              }}
              activeOpacity={0.7}
              style={{
                padding: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.md,
                  fontWeight: theme.fontWeights.medium,
                }}
              >
                Finish
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* =========================
            ADD TIME PICKER
        ========================= */}
        <TimerPickerModal
          visible={modalVisible}
          setIsVisible={setModalVisible}
          onConfirm={handleAddTime}
          onCancel={() => setModalVisible(false)}
          modalTitle="Add some time"
        />
      </View>
    </SafeAreaView>
  );
}
