import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimerPickerModal } from "react-native-timer-picker";
import theme from "../../styles/theme";
import { formatDuration } from "../../utils/formatTime";
import { baseTimerPickerModalStyles } from "../../styles/timerPicker";
import { FormCard } from "../common/FormCard";

export function TimedForm({ typeData, setTypeData }) {
  const [showPicker, setShowPicker] = useState(false);

  // Fallback to default state if typeData hasn't been set yet
  const duration = typeData || { hours: 1, minutes: 0 };

  return (
    <FormCard>
      <View style={styles.labelRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.label}>Duration</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.valueButton}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.valueLeft}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="hourglass-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.valueText}>{formatDuration(duration)}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        initialValue={duration}
        hideSeconds
        hourLabel="hr"
        minuteLabel="min"
        padHoursWithZero
        padMinutesWithZero
        modalTitle="Set duration"
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
        onConfirm={(newDuration) => {
          setTypeData(newDuration);
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        styles={{
          ...baseTimerPickerModalStyles,
          pickerContainer: {
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
          },
          pickerItemContainer: {
            height: 50,
          },
          disabledPickerItem: {
            color: theme.colors.disabled,
          },
          pickerLabel: {
            ...baseTimerPickerModalStyles.pickerLabel,
            fontWeight: theme.fontWeights.medium,
          },
          pickerLabelContainer: {
            marginLeft: 4,
          },
          pickerLabelGap: 10,
        }}
      />
    </FormCard>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  valueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  valueLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
  },
});

export default TimedForm;
