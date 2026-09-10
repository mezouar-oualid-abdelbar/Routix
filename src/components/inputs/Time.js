import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimerPickerModal } from "react-native-timer-picker";
import theme from "../../styles/theme";
import { FormatTime as formatTime } from "../../helpers/FormatTime";

export function Time({ time, setTime }) {
  const [showTime, setShowTime] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowTime(true)}
      >
        <View style={styles.timeButtonLeft}>
          <Ionicons
            name="alarm-outline"
            size={18}
            color={theme.colors.primary}
          />

          <Text style={styles.timeButtonText}>{formatTime(time)}</Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      <TimerPickerModal
        visible={showTime}
        setIsVisible={setShowTime}
        initialValue={time || { hours: 8, minutes: 0 }}
        hideSeconds
        modalTitle="Set time"
        onConfirm={(newTime) => {
          setTime(newTime);
          setShowTime(false);
        }}
        onCancel={() => {
          setShowTime(false);
        }}
        closeOnOverlayPress
        styles={{
          theme: "dark",

          backgroundColor: theme.colors.surface,

          pickerItem: {
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes.lg,
          },

          selectedPickerItem: {
            color: theme.colors.text,
            fontWeight: theme.fontWeights.bold,
            fontSize: theme.fontSizes.xl,
          },

          pickerLabel: {
            color: theme.colors.primary,
            fontSize: theme.fontSizes.sm,
          },

          modalTitle: {
            color: theme.colors.text,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.bold,
          },

          confirmButton: {
            color: theme.colors.background,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            overflow: "hidden",
            fontWeight: theme.fontWeights.bold,
          },

          cancelButton: {
            color: theme.colors.textSecondary,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
          },

          container: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },

  timeButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  timeButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
});
0;
