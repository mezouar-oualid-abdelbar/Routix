import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";

const initialTasks = [
  { id: "1", title: "Laundry", at: "12:00 PM", completed: false },
  { id: "2", title: "Dry", at: null, completed: false },
  { id: "3", title: "Fold", at: null, completed: false },
];

export default function FollowUpActivityScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeAlarmIndex, setActiveAlarmIndex] = useState(0);
  const [isAlerting, setIsAlerting] = useState(true);

  // Modal states for setting the next alarm time
  const [modalVisible, setModalVisible] = useState(false);
  const [nextAlarmTimeInput, setNextAlarmTimeInput] = useState("");

  const currentTask = tasks[activeAlarmIndex];

  // Triggered when user presses Complete
  const handleCompletePress = () => {
    if (activeAlarmIndex + 1 < tasks.length) {
      setModalVisible(true);
    } else {
      completeTaskWithoutModal();
    }
  };

  const completeTaskWithoutModal = () => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated[activeAlarmIndex].completed = true;
      return updated;
    });

    setIsAlerting(false);
    if (activeAlarmIndex + 1 < tasks.length) {
      setActiveAlarmIndex((prev) => prev + 1);
      setIsAlerting(true);
    }
  };

  const handleConfirmNextTime = () => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated[activeAlarmIndex].completed = true;

      if (activeAlarmIndex + 1 < updated.length && nextAlarmTimeInput.trim() !== "") {
        updated[activeAlarmIndex + 1].at = nextAlarmTimeInput;
      }

      return updated;
    });

    setModalVisible(false);
    setNextAlarmTimeInput("");
    setIsAlerting(false);

    if (activeAlarmIndex + 1 < tasks.length) {
      setActiveAlarmIndex((prev) => prev + 1);
      setIsAlerting(true);
    }
  };

  // Only available when the alarm is actively ringing on screen
  const handleRemindIn5Min = () => {
    setIsAlerting(false);
  };

  // If all tasks are completed
  if (activeAlarmIndex >= tasks.length || tasks.every(t => t.completed)) {
    return (
      <CompletionView
        title="All Alarms Completed! ⏰✨"
        buttonLabel="Reset Alarms"
        onPress={() => {
          setTasks(initialTasks);
          setActiveAlarmIndex(0);
          setIsAlerting(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {isAlerting ? (
          <View style={styles.alertBlock}>
            <Text style={styles.ringingLabel}>
              🔔 Alarm Ringing
            </Text>

            <Text style={styles.taskTitle}>
              {currentTask.title}
            </Text>

            <Text style={styles.scheduledFor}>
              Scheduled for: {currentTask.at || "Pending previous task"}
            </Text>

            <View style={styles.alertButtons}>
              <AppButton title="Complete" onPress={handleCompletePress} />
              <AppButton
                title="Remind in 5 min"
                onPress={handleRemindIn5Min}
                variant="secondary"
                textStyle={styles.remindText}
              />
            </View>
          </View>
        ) : (
          <View style={styles.snoozedBlock}>
            <Text style={styles.snoozedLabel}>
              Snoozed / Awaiting Next Alarm...
            </Text>
            <TouchableOpacity
              onPress={() => setIsAlerting(true)}
              style={styles.openAlarmButton}
            >
              <Text style={styles.openAlarmText}>
                Open Alarm
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal to Set Time for the Next Alarm */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                Set time for next task ({tasks[activeAlarmIndex + 1]?.title})
              </Text>

              <TextInput
                placeholder="e.g. 1:00 PM"
                placeholderTextColor={theme.colors.textSecondary}
                value={nextAlarmTimeInput}
                onChangeText={setNextAlarmTimeInput}
                style={styles.modalInput}
              />

              <View style={styles.modalButtonRow}>
                <AppButton
                  title="Save & Continue"
                  onPress={handleConfirmNextTime}
                  style={styles.flex}
                />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.cancelButton, styles.flex]}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  alertBlock: {
    alignItems: "center",
    width: "100%",
  },
  ringingLabel: {
    color: theme.colors.warning,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xxl * 1.2,
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  scheduledFor: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    marginBottom: theme.spacing.xxl,
  },
  alertButtons: {
    width: "100%",
    gap: theme.spacing.md,
  },
  remindText: {
    color: theme.colors.error,
  },
  snoozedBlock: {
    alignItems: "center",
  },
  snoozedLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    marginBottom: theme.spacing.md,
  },
  openAlarmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  openAlarmText: {
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  flex: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.bold,
  },
});
