import { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimerPickerModal } from "react-native-timer-picker";
import theme from "../styles/theme";

class TimedForm extends Component {
  state = {
    duration: { hours: 1, minutes: 0 },
    showPicker: false,
  };

  formatDuration = ({ hours, minutes }) => {
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  render() {
    const { duration, showPicker } = this.state;

    return (
      <View style={styles.container}>
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
          onPress={() => this.setState({ showPicker: true })}
        >
          <View style={styles.valueLeft}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="hourglass-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.valueText}>
              {this.formatDuration(duration)}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TimerPickerModal
          visible={showPicker}
          setIsVisible={(visible) => this.setState({ showPicker: visible })}
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
            this.setState({ duration: newDuration, showPicker: false });
          }}
          onCancel={() => this.setState({ showPicker: false })}
          closeOnOverlayPress
          styles={{
            theme: "dark",
            backgroundColor: theme.colors.surface,

            pickerContainer: {
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
            },
            pickerItemContainer: {
              height: 50,
            },
            pickerItem: {
              color: theme.colors.textSecondary,
              fontSize: theme.fontSizes.lg,
            },
            disabledPickerItem: {
              color: theme.colors.disabled,
            },
            selectedPickerItem: {
              color: theme.colors.text,
              fontWeight: theme.fontWeights.bold,
              fontSize: theme.fontSizes.xl,
            },
            pickerLabel: {
              color: theme.colors.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontWeights.medium,
            },
            pickerLabelContainer: {
              marginLeft: 4,
            },
            pickerLabelGap: 10,

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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
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
